import { Product } from "../../config/types"
import dbConn from "../../config/db"
import { Products } from "../../models/products"

const prodModel = new Products()
const testProd = {
    pid: 1,
    pname: 'New Product - Model test',
    pdesc: 'Testing models, Product test',
    pprice: 123,
} as Product

describe(`API Models test:`, () => {
    afterAll(async ()=> {
        const conn = await dbConn.connect();
        conn.query(`
        DELETE FROM order_products;
        DELETE FROM products;
        DELETE FROM users;
        ALTER SEQUENCE users_userid_seq RESTART WITH 1;
        ALTER SEQUENCE products_pid_seq RESTART WITH 1;
        ALTER SEQUENCE orders_orderid_seq RESTART WITH 1;`)
        conn.release();
    })
    describe(`Products model test`, () => {
        it('test [ CREATE PRODUCT ] Class', async () => {
            const addProduct = await prodModel.create(testProd.pname,testProd.pdesc,testProd.pprice);
            expect(addProduct.pname).toMatch(testProd.pname)
        })
        it('test [ SHOW PRODUCT ] Class', async () => {
            const showProduct = await prodModel.show(1)
            expect(showProduct.pprice).toEqual(testProd.pprice)
        })
        it('test [ INDEX OF PRODUCTS ] Class', async () => {
            const productsIndex = await prodModel.index()
            expect(productsIndex).toContain(testProd)
        })
    })
})