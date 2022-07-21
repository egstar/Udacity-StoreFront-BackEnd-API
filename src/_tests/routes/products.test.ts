import supertest from 'supertest'
import dbConn from '../../config/db'
import { Product, User } from  '../../config/types'
import app from '../../index'
import { Users } from '../../models/users'

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
    const testProd = {
        pname: "unique product name",
        pdesc: "The full description of the product may use json",
        pprice: 43210,
    } as Product
    beforeAll(async () => {
        const user = await userModel.create(testUser) // Creating a test user
        testUser.userid = Number(user?.userid)
        const conn = await dbConn.connect()
        conn.query(`UPDATE users SET rid=($1) WHERE userid=($2)`, [2,testUser.userid]) // Set user role to Admin
        conn.release();
        const response = await request
            .post('/user/login')
            .set('Content-type', 'application/json')
            .send({ user: testUser.username, pass: testUser.userpass })
        const { token: authHead } = response.body.data
        token = authHead
    })
    afterAll(async () => {
        const conn = await dbConn.connect()
        const sql = `
        DELETE FROM products;
        ALTER SEQUENCE products_pid_seq RESTART WITH 1;
        DELETE FROM users;
        ALTER SEQUENCE users_userid_seq RESTART WITH 1;` // Reset data after test
        await conn.query(sql)
        conn.release()
    })

    describe(`Product Routes:`, ()=> {
        it('Create a new product', async () => {
            const response = await request
                .post('/prod/new/')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({ pname:testProd.pname, pdesc: testProd.pdesc, pprice: testProd.pprice})
            
                const newProd = response.body.data
            testProd.pid = newProd.pid
            
            expect(response.status).toEqual(200)
            expect(newProd.pname).toEqual(testProd.pname)
        })
        it('Get Products list', async () => {
            const response = await request
                .get(`/prod`)
                .set('Content-type','application/json')
            const products = response.body.data
            expect(response.status).toEqual(200)
            expect(products.length).toEqual(1)
        })
        it('Get Product\'s details', async () => {
            const response = await request
                .get(`/prod/${testProd.pid}`)
                .set('Content-type','application/json')
            const products = response.body.data
            expect(response.status).toEqual(200)
            expect(products.pprice).toEqual(testProd.pprice)
        })
    })
})