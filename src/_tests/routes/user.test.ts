import supertest from 'supertest'
import dbConn from '../../config/db'
import { Users } from '../../models/users'
import { User } from '../../config/types'
import app from '../../index'

const userModel = new Users()
// create a request object
const request = supertest(app)
let token = ''

describe('End points test:', () => {
    const testUser = {
        username: 'test_user',
        userpass: 'abc123',
        email: 'test@test.com',
        firstname: 'First',
        lastname: 'Last',
    } as User
    beforeAll(async () => {
        const conn = await dbConn.connect()
        await conn.query(`
        DELETE FROM roles;
        ALTER SEQUENCE roles_rid_seq RESTART WITH 1;
        INSERT INTO roles (roleName) VALUES ('User');
        INSERT INTO roles (roleName) VALUES ('Admin');
        `)
        const user = await userModel.create(testUser)
        await conn.query(`UPDATE users SET rid=($1) WHERE userid=($2)`, [
            2,
            testUser.userid,
        ])
        conn.release()
        testUser.userid = Number(user?.userid)
        testUser.rid = Number(user?.rid)
    })

    afterAll(async () => {
        const conn = await dbConn.connect()
        const sql =
            'DELETE FROM users; ALTER SEQUENCE users_userid_seq restart with 1'
        await conn.query(sql)
        conn.release()
    })
    describe('User Routes:', () => {
        it('User Creation', async () => {
            const response = await request
                .post('/user/signup')
                .set('Content-type', 'application/json')
                .send({
                    username: 'test2User',
                    email: 'test2@test.com',
                    firstname: 'Test2',
                    lastname: 'User',
                    userpass: 'abc123',
                })
            const { newUser } = response.body.data
            expect(response.status).toBe(200)
            expect(isNaN(newUser.userid)).not.toBeTruthy()
        })
        it('Authentication', async () => {
            const response = await request
                .post('/user/login')
                .set('Content-type', 'application/json')
                .send({ user: testUser.username, pass: testUser.userpass })
            const { uInfo, token: authHead } = response.body.data
            token = authHead
            expect(response.status).toEqual(200)
            expect(uInfo).toEqual({
                rid: testUser.rid,
                userid: testUser.userid,
            })
        })
        it("Get User's index", async () => {
            const response = await request
                .get('/user')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toEqual(200)
            expect(response.body.length).toBeGreaterThan(1)
        })
        it(`Show single user with ID(2)`, async () => {
            const response = await request
                .get('/user/1')
                .set('Authorization', `Bearer ${token}`)
            const data = response.body
            expect(response.status).toEqual(200)
            expect(data.username).toMatch(testUser.username)
        })
    })
})
