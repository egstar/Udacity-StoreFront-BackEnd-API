import { User } from '../../config/types'
import dbConn from '../../config/db'
import { Users } from '../../models/users'

const userModel = new Users()
const testUser = {
    username: 'test_user',
    userpass: 'abc123',
    email: 'test@test.com',
    firstname: 'First',
    lastname: 'Last',
} as User

describe(`API Models:`, () => {
    beforeAll(async () => {
        const conn = await dbConn.connect()
        await conn.query(`
        DELETE FROM roles;
        ALTER SEQUENCE roles_rid_seq RESTART WITH 1;
        INSERT INTO roles (rolename) VALUES ('User');
        INSERT INTO roles (rolename) VALUES ('Admin');
        `)
        conn.release();
    })
    afterAll(async () => {
        const conn = await dbConn.connect()
        conn.query(`
        DELETE FROM order_products;
        DELETE FROM products;
        DELETE FROM orders;
        DELETE FROM users;
        ALTER SEQUENCE users_userid_seq RESTART WITH 1;
        ALTER SEQUENCE products_pid_seq RESTART WITH 1;
        ALTER SEQUENCE orders_orderid_seq RESTART WITH 1;`)
        conn.release()
    })
    describe(`User model`, () => {
        it('test [ CREATE UUSER ]  Class', async () => {
            const createUser = await userModel.create(testUser)
            testUser.userid = Number(createUser?.userid)
            expect(createUser?.username).toMatch(testUser.username)
        })
        it('test [ INDEX OF USERS ] Class', async () => {
            const usersIndex = await userModel.index()
            expect(usersIndex[0].email).toContain(testUser.email)
        })
        it('test [ SHOW USER ] Class', async () => {
            const getUser = await userModel.show(testUser.userid)
            expect(getUser).not.toBeUndefined()
        })
    })
})
