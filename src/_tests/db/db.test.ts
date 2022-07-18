import dbConn from '../../database/db'
{
    describe('Database tests:', () => {
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
            expect(result).toBeGreaterThan(0)
        })
    })
}
