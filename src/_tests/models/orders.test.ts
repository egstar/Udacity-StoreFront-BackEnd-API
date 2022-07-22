import { Order, User } from '../../config/types'
import dbConn from '../../config/db'
import { Orders } from '../../models/orders'
import { Products } from '../../models/products'
import { Users } from '../../models/users'

const orderModel = new Orders()
const prodModel = new Products()
const userModel = new Users()

const testOrder = {
    userid: 1,
    ostatus: 'Complete',
    ototal: 1000,
    products: [{ pid: 1, qty: 5 }],
} as Order
const testUser = {
    username: 'test_user',
    userpass: 'abc123',
    email: 'test@test.com',
    firstname: 'First',
    lastname: 'Last',
} as User

describe(`API Models test:`, () => {
    beforeAll(async () => {
        const conn = await dbConn.connect()
        await conn.query(`
        DELETE FROM roles;
        DELETE FROM orders;
        ALTER SEQUENCE orders_orderid_seq RESTART WITH 1;
        ALTER SEQUENCE roles_rid_seq RESTART WITH 1;
        INSERT INTO roles (rolename) VALUES ('User');
        INSERT INTO roles (rolename) VALUES ('Admin');
        `)
        conn.release();
        const addUser = await userModel.create(testUser)
        testUser.userid = addUser?.userid as number
        await prodModel.create('prod1', 'prod1 desc', 200)
        await prodModel.create('prod2', 'prod2 desc', 50)
        await prodModel.create('prod3', 'prod3 desc', 100)
    })
    afterAll(async () => {
        const conn = await dbConn.connect()
        await conn.query(`
        DELETE FROM order_products;
        DELETE FROM orders;
        DELETE FROM products;
        DELETE FROM users;
        ALTER SEQUENCE users_userid_seq RESTART WITH 1;
        ALTER SEQUENCE products_pid_seq RESTART WITH 1;
        ALTER SEQUENCE orders_orderid_seq RESTART WITH 1;`)
        conn.release()
    })
    describe(`Orders model test`, () => {
        it('test [ NEW ORDER ]  Class', async () => {
            const newOrder = await orderModel.create(testOrder)
            expect(newOrder).toBeDefined()
        })
        it('test [ INDEX OF ORDERS ] Class', async () => {
            const ordersList = await orderModel.index()
            expect(ordersList.length).toEqual(1)
        })
        it('test [ SHOW ORDER BY USER ] Class', async () => {
            const getOrder = await orderModel.currentOrder(
                testUser.userid,
                testOrder.ostatus
            )
            expect(getOrder.ototal).toBe(testOrder.ototal)
        })
    })
})
