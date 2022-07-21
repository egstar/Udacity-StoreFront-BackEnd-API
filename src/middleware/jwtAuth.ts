import { Request } from 'express'
import { verify, JwtPayload, sign } from 'jsonwebtoken'
import config from '../config/config'

const jwToken = config.jwToken as string // The token secret saved in our env variable

function oAuth(req: Request) {
    const authHeader = req.headers.authorization // Bearer token ex: bearer eyJhbGciOiJIUz...
    if (!authHeader) {
        throw new Error('Not Authenticated!')
    }
    const token = authHeader!.split(' ')[1] // Split the string to get the token after the word bearer
    const auth = verify(token as string, jwToken) as JwtPayload
    if (!auth.user.id ) {
        return null
    } else {
         return auth.user.id
    }
}

function isAdmin(req: Request) {
    const authHeader = req.headers.authorization
    const token = authHeader!.split(' ')[1]
    const admin = verify(token as string, jwToken) as JwtPayload
    if(admin.user.role = 2){
        return admin.user.id
    } else {
        return null
    }
}

function Verify(req: Request, uId?: number) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        throw new Error('Not authorized!')
    }
    const token = authHeader!.split(' ')[1]
    const decoded = verify(token as string, jwToken) as JwtPayload
    const jwtuserId = decoded.user.id
    const jwtuserRole = decoded.user.role
    if (uId && jwtuserId != uId) {
        // If the userId is passed and the decoded userId is not the same as the passed userId
        if (jwtuserRole != 2) {
            throw new Error('Not Authorized!') // Throw an error
        }
        return null
    }
    return Number(jwtuserId)
}

function Sign(id: number, role: number) {
    return sign({ user: { id, role } }, jwToken, { expiresIn: '24h' }) // Sign the token and add the userId to it
}

export { Verify, Sign, oAuth, isAdmin }
