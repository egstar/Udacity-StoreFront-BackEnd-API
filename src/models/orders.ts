import dbConn from '../config/db'
import { Order } from '../config/types'

export class Orders {
    async index(): Promise<Order[]> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `SELECT p.pid, p.pname as product,op.pqnty as quantity FROM orders AS ord INNER JOIN order_products AS op ON ord.orderid=op.orderid inner join products as p ON p.pid = op.pid ORDER BY ord.orderid ASC`
            const orders = await conn.query(sqlQuery)
            conn.release()
            if (!orders.rows.length) {
                throw new Error('No orders has been found.')
            }
            return orders.rows
        } catch (err) {
            throw new Error(`ERROR: ${err}`)
        }
    }

    async show(orderid: number): Promise<Order> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `SELECT (ord.*),p.pid, p.pname as product,op.pqnty as quantity FROM orders AS ord INNER JOIN order_products AS op ON ord.orderid=op.orderid inner join products as p ON p.pid = op.pid where orderid=($1) ORDER BY op.orderid ASC`
            const getOrder = await conn.query(sqlQuery, [orderid])
            conn.release()
            if (!getOrder) {
                throw new Error(
                    "Cannot find orders for this user or the user doesn't exist."
                )
            }
            const orderProducts = []
            for (const op of getOrder.rows) {
                orderProducts.push({
                    Product: op.product,
                    pid: op.pid,
                    qty: op.quantity,
                })
            }

            return {
                userid: getOrder.rows[0].userid,
                ostatus: getOrder.rows[0].ostatus,
                ototal: getOrder.rows[0].ototal,
                products: orderProducts,
            }
        } catch (err) {
            throw new Error(`ERROR: ${err}`)
        }
    }

    async delete(orderid: number): Promise<Order> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `DELET FROM order WHERE orderid=($1) RETURNING *`
            const delOrder = await conn.query(sqlQuery, [orderid])
            conn.release()

            if (!delOrder.rows[0]) {
                throw new Error(`Order number ${orderid} cannot be found`)
            }
            return delOrder.rows[0]
        } catch (err) {
            throw new Error(`Order ${orderid} cannot be delete, ${err}`)
        }
    }

    async create(newOrder: Order): Promise<Order> {
        const { userid, ostatus, products, ototal } = newOrder

        try {
            const conn = await dbConn.connect()
            const sqlQuery = `INSERT INTO orders (userid,ostatus,ototal) VALUES ($1,$2,$3) RETURNING orderid,userid,ostatus,ototal`
            const createOrder = await conn.query(sqlQuery, [
                userid,
                ostatus,
                ototal,
            ])
            if (!createOrder.rows.length) {
                throw new Error('Order cannot be completed at this time')
            }
            const neworderid = createOrder.rows[0].orderid
            let ordertotal = 0
            const newProducts = []
            for (const op of products) {
                const addProducts = await conn.query(
                    `INSERT INTO order_products VALUES ($1,$2,$3) RETURNING *`,
                    [neworderid, op.pid, op.qty]
                )
                newProducts.push(addProducts.rows[0])
                const getPrice = await conn.query(
                    `SELECT pprice FROM products WHERE pid=($1)`,
                    [op.pid]
                )
                ordertotal += getPrice.rows[0].pprice * op.qty
            }
            const orderCreated = await conn.query(
                `UPDATE orders SET ototal=($1) WHERE orderid=($2) RETURNING *`,
                [ordertotal, neworderid]
            )
            conn.release()
            const response = {
                userid: orderCreated.rows[0].userid,
                ostatus: orderCreated.rows[0].ostatus,
                products: newProducts,
                ototal: orderCreated.rows[0].ototal,
            }
            return response
        } catch (err) {
            throw new Error(`Cannot create order, ${err}`)
        }
    }

    async update(orderid: number, ostatus: string): Promise<Order> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `UPDATE orders SET ostatus=($1) WHERE orderid=($2) RETURNING ostatus`
            const setStatus = await conn.query(sqlQuery, [ostatus, orderid])
            conn.release()
            const orderStatus = setStatus.rows[0]
            return orderStatus
        } catch (err) {
            throw new Error(`Order cannot be updated, ${err}`)
        }
    }

    async currentOrder(userid: number, ostatus: string): Promise<Order> {
        try {
            if (ostatus != 'Complete') {
                ostatus = 'Active'
            }
            if (ostatus == 'complete') {
                ostatus = 'Complete'
            }
            const conn = await dbConn.connect()
            const sqlQuery = `SELECT * FROM orders where userid=($1) AND ostatus=($2) ORDER BY orderid ASC`
            const getOrder = await conn.query(sqlQuery, [userid, ostatus])
            const getProducts = await conn.query(
                `SELECT op.pid, op.pqnty from order_products op inner join products p on op.pid=p.pid where orderid=($1) ORDER BY orderid ASC`,
                [getOrder.rows[0].orderid]
            )
            const products = getProducts.rows
            const productsList = []
            for (const op of products) {
                productsList.push({ pid: op.pid, qty: op.pqnty })
            }
            return {
                userid: getOrder.rows[0].userid,
                ostatus: getOrder.rows[0].ostatus,
                ototal: getOrder.rows[0].ototal,
                products: productsList,
            }
        } catch (err) {
            throw new Error(`ERROR: ${err}`)
        }
    }
}
