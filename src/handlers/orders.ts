import { Orders } from '../models/orders'
import express, {Request,Response} from 'express'
import {Verify, oAuth} from '../middleware/jwtAuth'


const orderModel = new Orders()

const index = async(req: Request, res: Response )=> {
    try {
        const Authenticated = await oAuth(req)
        if(!Authenticated){
            res.status(401)
            .json({
                "status": "error",
                "message": "Please login first before using this action."
            })
        }
        const orders = await orderModel.index()
        res.status(200).send(orders)
    }catch(err) {
        const e = err as Error
        res.status(401)
        .json({
            "status": "error",
            "message": e.message
        })

    }

}
const show = async(req: Request, res: Response )=> {
    try {
        const orderid  = Number(req.params.id)
        const Authenticated = await oAuth(req)
        if(!Authenticated){
            res.status(401)
            .json({
                "status": "error",
                "message": "Please login first before doing this action."
            })
        }
        const Authorized = Verify(req, Authenticated)
        if(!Authorized){
            res.status(401)
            .json({
                "status": "error",
                "message": "Cannot retrive user information."
            })
        }
        const orders = await orderModel.show(orderid)

        res.status(200)
        .json({
            "status": "success",
            "data": orders,
            "message": "Order list retrived successfully."
        })
    }catch(err) {
        const e = err as Error

        res.status(401)
        .json({
            "status": "error",
            "message": e.message
        })

    }

}
const create = async(req: Request, res: Response )=> {
    try {
        const Authorize = await oAuth(req)
        if(!Authorize) {
            res.status(401)
            .json({
                "status": "error",
                "message": "login required for completing this action"
            })
        }
        const userid = Authorize;
        const { products } = req.body
        const odate = new Date().getDate()
        const ostatus = 'Active'
        const ototal = 1;
        const newOrder = await orderModel.create({userid, ostatus, ototal, products})
        if(!newOrder){
            res
            .status(402)
            .json({
                "status": "error",
                "message": "Cannot add the oreder, please try again"
            })
        }
        res
            .status(200)
            .json({
                "status": "success",
                "data": newOrder,
                "message": "Order created successfully."
            })

    }catch(err) {
        const e = err as Error
        res.send(e.message).status(401)
        
    }

}
const currentOrder = async (req: Request, res: Response) => {
    try {
        const { ostatus } = req.body
        const Authorized = oAuth(req)
        if(!Authorized){
            res.status(401)
            .json({
                "status": "error",
                "message": "Not authorized"
            })
        }
        const userid = Number(Authorized)
        const currentorder = await orderModel.currentOrder(userid, ostatus)
        res.status(200)
        .send(currentorder)


    } catch(err) {
        const e= err as Error
        res.send(e.message).status(401)
    }

}
const orderRoutes = (app: express.Application) => {
    app.get('/orders', index)
    app.post('/order/new', create)
    app.get('/order/:id', show)
    app.get('/user/:id/order', currentOrder)
    
 

}

export default orderRoutes