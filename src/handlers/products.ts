import {Products} from '../models/products'
import express, {Request,Response} from 'express'
import {isAdmin, oAuth} from '../middleware/jwtAuth'

const prodModel = new Products()

const index = async(req: Request, res: Response )=> {
    try {
        const products = await prodModel.index()
        res.status(200)
        .json({
            "status": "success",
            "data": products,
            "message": "Products list"
        })

    }catch(err) {
        const e = err as Error
        res.status(401)
        res.send(e.message)

    }

}
const show = async(req: Request, res: Response )=> {
    try {
        const { pid } = req.params
        const product = await prodModel.show(Number(pid))
        res
        .status(200)
        .json({
            "status":"success",
            "data": product,
            "message": `Product No.[ ${pid} ] details`
        })

    } catch(err) {
        const e = err as Error
        res.status(403).send(e.message)
    }

}
const create = async(req: Request, res: Response )=> {
    try {
        const {pname, pdesc, pprice} = req.body
        if(!pname || !pdesc || !pprice) {
            res.status(401)
            .json({
                "status": "error",
                "message": "Missing some information, please send info back"
            })
        }
        const Authenticated = oAuth(req)
        if(!Authenticated){
            res.status(403)
            .json({
                "status": "error",
                "message": "Please login first to do this action"
            })
        }
        const Authorized = isAdmin(req)
        if(!Authorized){
            res.status(403)
            .json({
                "status": "error",
                "message": "Only admins can create new products"
            })
        }
        const newProduct = await prodModel.create(pname, pdesc, pprice)
        res.status(200)
        .json({
            "status": "success",
            "data": newProduct,
            "message": `Product ${newProduct.pid} has been added successfully`
        })
        

    }catch(err) {
        const e = err as Error
        res.status(403).send(e.message)
    }

}
const productRoutes = (app: express.Application) => {
    app.get('/prod/', index)
    app.get('/prod/:pid', show)
    app.post('/prod/new', create)

}

export default productRoutes