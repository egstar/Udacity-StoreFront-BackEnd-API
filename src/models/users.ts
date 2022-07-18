import dbConn from '../database/db'
import bcrypt from 'bcrypt'

export type User = {
    userid: number
    uname: string
    email: string
    fname: string
    lname: string
    passwd: string
    rolename: string
}
const pepper = process.env.BCRYPT_PASSWORD
const saltRounds = process.env.SALT_ROUNDS as unknown as number

export class Users {
    async index(): Promise<User[]> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `SELECT rolename,userid,email,uname,fname,lname FROM user_roles INNER JOIN roles ON roleid = roles.id INNER JOIN users ON users.id = userid`
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
            const sqlQuery = `SELECT rolename,userid,email,uname,fname,lname FROM user_roles INNER JOIN roles ON roleid = roles.id INNER JOIN users ON users.id = userid WHERE userid=($1)`
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
            const sqlQuery = `INSERT INTO users (uname, email, fname, lname, passwd) VALUES ($1,$2,$3,$4,$5) RETURNING *`
            const passHash = bcrypt.hashSync(
                u.passwd + pepper,
                Number(saltRounds)
            )
            const userAdd = await conn.query(sqlQuery, [
                u.uname,
                u.email,
                u.fname,
                u.lname,
                passHash,
            ])
            if (userAdd) {
                await conn.query(
                    `INSERT INTO user_roles VALUES (($1), 2) returning *`,
                    [userAdd.rows[0].id]
                )
            }
            const userInfo = await conn.query(
                `SELECT rolename,userid,email,uname,fname,lname FROM user_roles INNER JOIN roles ON roleid = roles.id INNER JOIN users ON users.id = userid WHERE userid=($1)`,
                [userAdd.rows[0].id]
            )
            conn.release()
            if (userInfo.rows[0]) {
                return userInfo.rows[0]
            }
            return null
        } catch (err) {
            throw new Error(
                `Registeration failed with user ${u.uname} with error: ${err}`
            )
        }
    }
    async update(u: User): Promise<User> {
        try {
            const conn = await dbConn.connect()
            const passHash = bcrypt.hashSync(
                u.passwd + pepper,
                Number(saltRounds)
            )
            let qParams: unknown = ''
            let qVals = 0
            const sqParams: unknown[] = []
            if (u.uname !== '') {
                qVals += 1
                qParams += 'uname=($' + qVals + '),'
                sqParams.push(u.uname)
            }
            if (u.uname !== '') {
                qVals += 1
                qParams += 'email=($' + qVals + '),'
                sqParams.push(u.email)
            }
            if (u.fname !== '') {
                qVals += 1
                qParams += 'fname=($' + qVals + '),'
                sqParams.push(u.fname)
            }
            if (u.lname !== '') {
                qVals += 1
                qParams += 'lname=($' + qVals + '),'
                sqParams.push(u.lname)
            }
            if (u.passwd !== '') {
                qVals += 1
                qParams += 'passwd=($' + qVals + '),'
                sqParams.push(passHash)
            }
            qParams = String(qParams).slice(0, -1)
            const sqlQuery = `UPDATE users SET ${qParams} WHERE id=(${u.userid}) RETURNING *`
            const userUp = await conn.query(sqlQuery, sqParams)
            conn.release()
            return userUp.rows[0]
        } catch (err) {
            throw new Error(`Error updating user info with ${err}`)
        }
    }
    async setRole(id: number, role: number): Promise<User> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `UPDATE users SET roleid=($2) where userid=($1) RETURNING *`
            const newRole = await conn.query(sqlQuery, [id, role])
            const usrRole = await conn.query(
                `select rolename from user_roles inner join roles on roleid = roles.id inner join users on users.id = userid where userid = ($1)`,
                [id]
            )
            conn.release()
            if (newRole) {
                return usrRole.rows[0]
            }
            return usrRole.rows[0]
        } catch (err) {
            throw new Error(`Cant update user role, ${err}`)
        }
    }
    async getRole(id: number): Promise<User | null> {
        try {
            const conn = dbConn.connect()
            const userCheck = await conn.query(
                `SELECT roleid from user_roles WHERE userid=($1)`,
                [id]
            )
            if (userCheck.rows[0].roleid !== 1) {
                throw new Error('Invalid token, user access does not met.')
            }
            return userCheck.rows[0].roleid
        } catch (err) {
            throw new Error(`${err}`)
        }
    }
    async delete(id: number): Promise<User | null> {
        try {
            const conn = await dbConn.connect()
            const userCheck = await conn.query(
                `SELECT uname from users where id=($1)`,
                [id]
            )
            if (!userCheck.rows.length) {
                throw new Error('User not found.')
            }
            await conn.query(`DELETE FROM users WHERE id=($1) RETURNING *`, [
                id,
            ])
            conn.release()
            return userCheck.rows[0].uname
        } catch (err) {
            throw new Error(`Error deleting user, ${err}`)
        }
    }
    async authenticate(user: string, pass: string): Promise<User | null> {
        try {
            const conn = await dbConn.connect()
            const sqlQuery = `select passwd from users where uname=($1)`
            const userAuth = await conn.query(sqlQuery, [user])
            if (userAuth.rows.length) {
                if (
                    bcrypt.compareSync(pass + pepper, userAuth.rows[0].passwd)
                ) {
                    const isValidPass = await conn.query(
                        `select rolename,userid,email,fname,lname from user_roles inner join roles on roleid = roles.id inner join users on users.id = userid WHERE uname=($1)`,
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
