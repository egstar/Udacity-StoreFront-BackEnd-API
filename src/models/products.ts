import dbConn from '../config/db'
import { Product } from '../config/types'

export class Products {
    async index(): Promise<Product[]> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `SELECT * FROM products`
            const products = await conn.query(sqlQuery)
            conn.release()
            return products.rows
        } catch (err) {
            throw new Error(`Not accessible, ${err}`)
        }
    }
    async show(pid: number): Promise<Product> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `SELECT * FROM products where pid=($1)`
            const product = await conn.query(sqlQuery, [pid])
            conn.release()
            if (!product.rows.length) {
                throw new Error(`Products doesn't exists, please try again`)
            }
            return product.rows[0]
        } catch (err) {
            throw new Error(
                `Can't display this page without a permission, ${err}`
            )
        }
    }
    async create(
        pname: string,
        pdesc: string,
        pprice: number
    ): Promise<Product> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `INSERT INTO products (pname,pdesc,pprice) VALUES ($1,$2,$3) RETURNING *`
            const createProduct = await conn.query(sqlQuery, [
                pname,
                pdesc,
                pprice,
            ])
            conn.release()
            if (!createProduct.rows[0]) {
                throw new Error('Product cannot be added.')
            }
            return createProduct.rows[0]
        } catch (err) {
            throw new Error(`Cannot add new product, ${err}`)
        }
    }
}
