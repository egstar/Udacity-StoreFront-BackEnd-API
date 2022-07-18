import { Request } from 'express'
import { verify, JwtPayload, sign } from 'jsonwebtoken'
import config from '../config/config'

const jwToken = config.jwToken as string // The token secret saved in our env variable
function oAuth(req: Request) {
    const authHeader = req.headers.authorization // Bearer token ex: bearer eyJhbGciOiJIUz...
    if (!authHeader) {
        throw new Error('Not authorized!')
    }
    const token = authHeader!.split(' ')[1] // Split the string to get the token after the word bearer
    const auth = verify(token as string, jwToken) as JwtPayload
    if (!auth.user.id) throw new Error('Not authorized!')
    else return auth.user.id
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
        if (jwtuserRole != 'Admin') {
            throw new Error('Unauthorized!') // Throw an error
        }
        return jwtuserId
    }
    return jwtuserId
}

function Sign(id: number, role: string) {
    return sign({ user: { id, role } }, jwToken, { expiresIn: '2h' }) // Sign the token and add the userId to it
}

export { Verify, Sign, oAuth }
