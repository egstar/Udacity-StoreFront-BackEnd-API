import dbConn from '../../config/db'
{
    describe('Database tests:', () => {
        afterAll( async () => {
            const conn = await dbConn.connect();
            conn.query(`
            DELETE FROM order_products;
            DELETE FROM orders;
            DELETE FROM products;
            DELETE FROM users;
            ALTER SEQUENCE users_userid_seq RESTART WITH 1;
            ALTER SEQUENCE products_pid_seq RESTART WITH 1;
            ALTER SEQUENCE orders_orderid_seq RESTART WITH 1;`)
            conn.release();
        })

        it('Establishing connection', async () => {
            let result
            try {
                const conn = await dbConn.connect()
                const sQ = 'SELECT COUNT(*)'
                const resp = await conn.query(sQ)
                conn.release()
                result = resp.rows.length
            } catch (err) {
                throw new Error(`${err}`)
            }
            expect(result).not.toBeFalsy()
        })
        it('Use `INSERT` with database', async () => {
            const conn = await dbConn.connect()
            const sqlTest = await conn.query(`INSERT INTO roles (rolename) VALUES('SuperUser') RETURNING *`)
            conn.release();
            expect(sqlTest.rows[0].rolename).toContain('SuperUser')
        })
        it('Use `SELECT` with database', async () => {
            const conn = await dbConn.connect()
            const sqlTest = await conn.query(`SELECT * from roles;`)
            conn.release();
            expect(sqlTest.rows.length).toBeGreaterThanOrEqual(3)
        })
        it('use `UPDATE` with database', async () => {
            const conn = await dbConn.connect()
            const sqlTest = await conn.query(`UPDATE roles SET rolename='SuperTestUser' where rid=3 returning *;`)
            conn.release();
            expect(sqlTest.rows[0].rolename).not.toBeNull()
        })
        it('use `DELETE` with database', async () => {
            const conn = await dbConn.connect()
            const sqlTest = await conn.query(`DELETE FROM roles WHERE rolename='SuperTestUser' returning *;`)
            conn.release();
            console.log(sqlTest.rows[0])
            expect(sqlTest.rows[0]).toBeTruthy()

        })
    })
}
