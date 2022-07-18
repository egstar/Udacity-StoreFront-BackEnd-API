import config from '../config/config'
import { Pool } from 'pg'
const connPort: number = config.dbPort as unknown as number
let dbName
const nodeEnv = config.envMode
if (nodeEnv === 'test') {
    dbName = config.testDb
} else {
    dbName = config.dbName
}
const dbConn = new Pool({
    host: config.dbHost,
    database: dbName,
    user: config.dbUser,
    password: config.dbPass,
    port: connPort,
})
export default dbConn
