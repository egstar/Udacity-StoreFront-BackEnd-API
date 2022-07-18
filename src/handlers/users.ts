import { User, Users } from '../models/users'
import express, { Request, Response } from 'express'
import { Verify, Sign, oAuth } from '../middleware/jwtAuth'

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
        const uId = Number(req.body.uid)
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
        const { uname, email, fname, lname, passwd } = req.body
        const userid = 0
        const rolename = 'User'
        if (!(uname || email || fname || lname || passwd)) {
            return res
                .status(400)
                .send('Please Enter all required infromation.')
        }
        const user: User = {
            userid,
            uname,
            email,
            fname,
            lname,
            passwd,
            rolename,
        }
        const newUser = await userModel.create(user)
        res.json({
            status: 'Success',
            data: { newUser },
            message: `User ${uname} has been created succefully.`,
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

const update = async (req: Request, res: Response) => {
    try {
        const { uid, un, fn, ln, pwd, ul, us } = req.body
    } catch (err) {
        const e = err as Error
        if (e.message.includes('')) {
            res.status(500).send(e.message)
        } else {
            res.status(401).send(e.message)
        }
    }
}

const setRole = async (req: Request, res: Response) => {
    try {
        const { uid, urole } = req.body
    } catch (err) {
        const e = err as Error
        if (e.message.includes('')) {
            res.status(500).send(e.message)
        } else {
            res.status(401).send(e.message)
        }
    }
}

const userDel = async (req: Request, res: Response) => {
    try {
        if (!req.body.userid) {
            return res.status(401).send('Please insert a valid user id!')
        }
        const userId = Number(req.body.userid)
        const userAuth = Verify(req, userId)
        if (!userAuth) {
            res.json({
                status: ' Failed.',
                data: 'user ' + userAuth,
                message: 'User is not authorized for this action.',
            })
        }
        if (userAuth != userId) {
            const usrRole = await userModel.getRole(userAuth)

            if (Number(usrRole) !== 1) {
                res.json({
                    status: 'Failed',
                    message: 'You cannot do this action',
                })
            }
        }
        const delUser = await userModel.delete(userId)
        if (delUser) {
            res.json({
                status: 'Success',
                username: delUser,
                message: 'Deleted successfully',
            })
        }
    } catch (err) {
        const e = err as Error
        return res.status(401).send(e.message)
    }
}

const authenticate = async (req: Request, res: Response) => {
    const { uname, pwd } = req.body
    if (!uname || !pwd) {
        return res
            .status(400)
            .send('You have to enter a valid user name and password.')
    }
    try {
        const uInfo = await userModel.authenticate(uname, pwd)
        if (uInfo === null) {
            res.status(401)
            res.json({
                status: 'Error',
                message: 'Invalid username or password',
            })
        } else {
            const token = Sign(uInfo.userid, uInfo.rolename)
            res.json({
                status: 'Success',
                data: { uInfo, token },
                message: `Successfully logged in, Welcome ${uname}`,
            })
        }
    } catch (err) {
        const e = err as Error
        res.status(401).send(e.message)
    }
}

const UserRoutes = (app: express.Application) => {
    app.get('/user/', index)
    app.get('/user/dashboard', index)
    app.get('/user/profile', show)
    app.post('/user/signup', create)
    app.put('/user/edit', update)
    app.delete('/user/del', userDel)
    app.post('/user/login', authenticate)
    app.put('/admin/usr/setrole', setRole)
}

export default UserRoutes
