import dbConn from '../config/db'
import bcrypt from 'bcrypt'
import { User } from '../config/types'

const pepper = process.env.BCRYPT_PASSWORD
const saltRounds = process.env.SALT_ROUNDS as unknown as number

export class Users {
    async index(): Promise<User[]> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `SELECT rolename,userid,email,username,firstname,lastname FROM users INNER JOIN roles ON users.rid = roles.rid`
            const users = await conn.query(sqlQuery)
            conn.release()
            return users.rows
        } catch (err) {
            throw new Error(`Access denied, ${err}`)
        }
    }
    async show(id: number): Promise<User> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `SELECT rolename,userid,email,username,firstname,lastname FROM users INNER JOIN roles ON users.rid = roles.rid WHERE userid=($1)`
            const userGet = await conn.query(sqlQuery, [id])
            conn.release()
            return userGet.rows[0]
        } catch (err) {
            throw new Error(`User not found or no access, ${err}`)
        }
    }
    async create(u: User): Promise<User | null> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `INSERT INTO users (username, email, firstname, lastname, userpass) VALUES ($1,$2,$3,$4,$5) RETURNING userid,username,email,firstname,lastname,rid`
            const passHash = bcrypt.hashSync(
                u.userpass + pepper,
                Number(saltRounds)
            )
            const userAdd = await conn.query(sqlQuery, [
                u.username,
                u.email,
                u.firstname,
                u.lastname,
                passHash,
            ])

            conn.release()
            if (!userAdd) {
                return null
            }
            return userAdd.rows[0]
        } catch (err) {
            throw new Error(
                `Registeration failed with user ${u.username} with error: ${err}`
            )
        }
    }
    async setRole(id: number, role: number): Promise<User> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `UPDATE users SET rid=($2) where userid=($1) RETURNING rid`
            const newRole = await conn.query(sqlQuery, [id, role])
            const roleName = await conn.query(
                `SELECT rolename FROM roles WHERE rid=($1)`,
                [newRole.rows[0].rid]
            )
            conn.release()
            if (!newRole) {
                throw new Error("Can't update user role")
            }
            return roleName.rows[0].rolename
        } catch (err) {
            throw new Error(`Cant update user role, ${err}`)
        }
    }
    async getRole(id: number): Promise<User> {
        try {
            const conn = await dbConn.connect()
            const userCheck = await conn.query(
                `SELECT rid from users WHERE userid=($1)`,
                [id]
            )
            if (userCheck.rows[0].rid !== 2) {
                throw new Error('Invalid token, user access does not met.')
            }
            return userCheck.rows[0].rid
        } catch (err) {
            throw new Error(`${err}`)
        }
    }

    async authenticate(user: string, pass: string): Promise<User | null> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `select userpass from users where username=($1)`
            const userAuth = await conn.query(sqlQuery, [user])
            if (userAuth.rows.length) {
                if (
                    bcrypt.compareSync(pass + pepper, userAuth.rows[0].userpass)
                ) {
                    const isValidPass = await conn.query(
                        `select rid,userid FROM users WHERE username=($1)`,
                        [user]
                    )
                    const uInfo = isValidPass.rows[0]
                    return uInfo
                } else {
                    throw new Error('Wrong Password.')
                }
            }
            conn.release()
            return null
        } catch (err) {
            throw new Error(`Authenticating error, ${err}`)
        }
    }
}
