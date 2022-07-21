import { Users } from '../models/users'
import { User } from '../config/types'
import express, { Request, Response } from 'express'
import { isAdmin, Verify, Sign, oAuth } from '../middleware/jwtAuth'

const userModel = new Users()

const index = async (req: Request, res: Response) => {
    try {
        oAuth(req)
        const userList = await userModel.index()
        res.status(200).send(userList)
    } catch (err) {
        const e = err as Error
        if (e.message.includes('Access denied.')) {
            res.status(500).json(e.message)
        } else {
            res.status(401).json(e.message)
        }
    }
}

const show = async (req: Request, res: Response) => {
    try {
        const uId = Number(req.params.id)
        if (!uId) {
            return res
                .status(400)
                .send('User id is missing, pelase insert a valid USER ID')
        }
        Verify(req, uId)
        const thisUser = await userModel.show(uId)
        res.status(200).send(thisUser)
    } catch (err) {
        const e = err as Error
        if (e.message.includes('User not found or no access, ')) {
            res.status(500).json(e.message)
        } else {
            res.status(401).json(e.message)
        }
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const { username, email, firstname, lastname, userpass } = req.body
        const userid = 0
        const rid = 1
        if (!(username || email || firstname || lastname || userpass)) {
            return res
                .status(400)
                .send('Please Enter all required infromation.')
        }
        const user: User = {
            userid,
            username,
            email,
            firstname,
            lastname,
            userpass,
            rid,
        }

        const newUser = await userModel.create(user)
        res.json({
            status: 'Success',
            data: { newUser },
            message: `User ${username} has been created succefully.`,
        })
    } catch (err) {
        const e = err as Error
        if (e.message.includes('Registeration failed with user')) {
            res.status(500).json(e.message)
        } else {
            res.status(401).json(e.message)
        }
    }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
const setRole = async (req: Request, res: Response) => {
    try {
        const { userid, roleid } = req.body
        if (!userid || !roleid) {
            res.status(301).json({
                status: 'error',
                message:
                    'User id or Role are missing, please insert valid user id or role',
            })
        }
        const authorized = isAdmin(req)

        if (!authorized) {
            res.status(301).json({
                status: 'error',
                message: 'Only admin have access to set user roles',
            })
        }
        const myid = Number(authorized)

        if (userid == myid) {
            res.status(401).json({
                status: 'error',
                message: 'You cannot change your role',
            })
        }
        const setUserRole = await userModel.setRole(userid, roleid)
        if (!setUserRole) {
            res.status(401).json({
                status: 'error',
                message: 'cannot set user role',
            })
        }
        res.status(200).json({
            status: 'success',
            data: setUserRole,
            message: 'User access has been changed successully',
        })
    } catch (err) {
        const e = err as Error
        if (e.message.includes('')) {
            res.status(500).send(e.message)
        } else {
            res.status(401).send(e.message)
        }
    }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
const authenticate = async (req: Request, res: Response) => {
    const { user, pass } = req.body
    if (!user || !pass) {
        return res
            .status(400)
            .send('You have to enter a valid user name and password.')
    }
    try {
        const uInfo = await userModel.authenticate(user, pass)
        if (uInfo === null) {
            res.status(401)
            res.json({
                status: 'Error',
                message: 'Invalid username or password',
            })
        } else {
            const token = Sign(uInfo.userid, uInfo.rid)
            res.json({
                status: 'Success',
                data: { uInfo, token },
                message: `Successfully logged in, Welcome ${user}`,
            })
        }
    } catch (err) {
        const e = err as Error
        res.status(401).send(e.message)
    }
}

const UserRoutes = (app: express.Application) => {
    app.get('/user/', index)
    app.get('/user/:id', show)
    app.post('/user/signup', create)
    app.post('/user/login', authenticate)
}

export default UserRoutes
