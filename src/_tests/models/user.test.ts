import supertest from 'supertest'
import dbConn from '../../database/db'
import { User, Users } from '../../models/users'
import app from '../../index'

const userModel = new Users()
// create a request object
const request = supertest(app)
let token = ''

describe('User API endpoints', () => {
    const testUser = {
        uname: 'test_user',
        passwd: 'abc123',
        email: 'test@test.com',
        fname: 'First',
        lname: 'Last',
    } as User
    beforeAll(async () => {
        const user = await userModel.create(testUser)
        testUser.userid = Number(user?.userid)
        const conn = await dbConn.connect()
        await conn.query(`update user_roles set roleid=1 where userid=($1)`, [
            testUser.userid,
        ])
        conn.release()
    })

    afterAll(async () => {
        const conn = await dbConn.connect()
        const sql = 'DELETE FROM users;'
        await conn.query(sql)
        conn.release()
    })
    describe('Test Auth route', () => {
        it('should authenticate and return token', async () => {
            const response = await request
                .post('/user/login')
                .set('Content-type', 'application/json')
                .send({ uname: testUser.uname, pwd: testUser.passwd })
            expect(response.status).toBe(200)
            const { uInfo, token: userToken } = response.body.data
            expect(uInfo.userid).toBe(testUser.userid)
            expect(uInfo.email).toBe(testUser.email)
            token = userToken
        })

        it('should fail with status 401 with wrong credentials', async () => {
            const response = await request
                .post('/user/login')
                .set('Content-type', 'application/json')
                .send({ uname: 'invalidEmail@test.com', pwd: 'wrong-password' })

            expect(response.status).toBe(401)
        })
    })
    describe('Test CRUD Operations', () => {
        it('should create new user', async () => {
            const response = await request
                .post('/user/signup')
                .set('Content-type', 'application/json')
                .send({
                    uname: 'test2User',
                    email: 'test2@test.com',
                    fname: 'Test2',
                    lname: 'User',
                    passwd: 'abc123',
                })
            expect(response.status).toBe(200)
            const { newUser } = response.body.data
            expect(newUser.email).toBe('test2@test.com')
            expect(newUser.uname).toBe('test2User')
            expect(newUser.fname).toBe('Test2')
            expect(newUser.lname).toBe('User')
        })
        it('should retrieve all users', async () => {
            const response = await request
                .get('/user/list')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200)
            expect(response.body.length).toBe(2)
        })
    })
})
