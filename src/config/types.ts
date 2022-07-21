export type orderProduct = {
    pid: number
    qty: number
}
export type Product = {
    pid: number
    pname: string
    pdesc: string
    pprice: number
}
export type Order = {
    userid: number
    ostatus: string
    ototal: number
    products: orderProduct[]
}
export type User = {
    userid: number
    username: string
    email: string
    firstname: string
    lastname: string
    userpass: string
    rid: number
}
