import dotenv from 'dotenv'

dotenv.config()

const {
    APP_HOST,
    APP_PORT,
    ENV,
    SECRET_TOKEN,
    BCRYPT_PASSWORD,
    SALT_ROUNDS,
    DB_HOST,
    DB_NAME,
    DB_TEST,
    DB_USER,
    DB_PASS,
    DB_PORT,
} = process.env

export default {
    appPort: APP_PORT,
    appHost: APP_HOST,
    envMode: ENV,
    jwToken: SECRET_TOKEN,
    bcryptP: BCRYPT_PASSWORD,
    bcrypts: SALT_ROUNDS,
    dbHost: DB_HOST,
    dbName: DB_NAME,
    testDb: DB_TEST,
    dbUser: DB_USER,
    dbPass: DB_PASS,
    dbPort: DB_PORT,
}
