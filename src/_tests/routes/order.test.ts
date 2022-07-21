import supertest from 'supertest'
import dbConn from '../../config/db'
import { Order, User } from '../../config/types'
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
    const testOrder = {
        products: [
            { pid: 1, qty: 2 },
            { pid: 3, qty: 2 },
            { pid: 2, qty: 1 },
        ], // pid = ProductId , qty= Quantity
    } as Order

    beforeAll(async () => {
        const user = await userModel.create(testUser) // Creating a test user
        testUser.userid = Number(user?.userid)
        const conn = await dbConn.connect()
        conn.query(`UPDATE users SET rid=($1) WHERE userid=($2)`, [
            2,
            testUser.userid,
        ]) // Set user role to Admin
        conn.query(
            `INSERT INTO products (pname,pdesc,pprice) 
            VALUES
            ($1,$2,$3),
            ($4,$2,$5),
            ($6,$2,$7)`,
            ['Product', 'Description', 10, 'Product2', 20, 'Product3', 50]
        ) // Creating a product list for test
        conn.release()
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
        DELETE FROM order_products; 
        DELETE FROM orders;
        ALTER SEQUENCE orders_orderid_seq RESTART WITH 1;
        DELETE FROM products;
        ALTER SEQUENCE products_pid_seq RESTART WITH 1;
        DELETE FROM users;
        ALTER SEQUENCE users_userid_seq RESTART WITH 1;` // Reset data after test
        await conn.query(sql)
        conn.release()
    })
    describe('Order Routes:', () => {
        it('Create order', async () => {
            const response = await request
                .post('/order/new/')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({ products: testOrder.products })
            const newOrder = response.body.data
            expect(response.status).toEqual(200)
            expect(newOrder.ototal).toEqual(140)
        })
        it("Current User's Order", async () => {
            const response = await request
                .get(`/user/${testUser.userid}/order/`)
                .set('Authorization', `Bearer ${token}`)
                .send({ ostatus: 'Active' })
            expect(response.status).toEqual(200)
            expect(response.body.userid).toEqual(testUser.userid)
            expect(response.body.products.length).toEqual(
                testOrder.products.length
            )
        })
    })
})
