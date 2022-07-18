import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import userRoutes from './handlers/users'
import config from './config/config'

const app: express.Application = express()
const AppPort: unknown = config.appPort || 3000

app.use(bodyParser.json())
app.use(express.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

userRoutes(app)

app.listen(AppPort, function () {
    /* eslint-disable no-console */
    console.log(
        ' ##############################',
        '\n',
        '|    \x1b[4m\x1b[47m Application Status \x1b[0m    |',
        '\n',
        '##############################',
        '\n',
        "- \x1b[30;1mServer's Mode: \x1b[34m>  ",
        '\x1b[36m\x1b[4m ' + config.envMode + ' \x1b[0m    ',
        '\n',
        "- \x1b[30;1mServer's Host: \x1b[34m>",
        '\x1b[32m\x1b[1m' + config.appHost + '\x1b[0m  ',
        '\n',
        "- \x1b[30;1mServer's Port: \x1b[34m> ",
        '\x1b[33m\x1B[3m  ' + AppPort + '\x1b[0m    ',
        '\n',
        '- \x1b[30;1mDatabase Port: \x1b[34m> ',
        '\x1b[33m\x1B[3m  ' + config.dbPort + '\x1b[0m    ',
        '\n',
        '- \x1b[30;1mMain Database: \x1b[34m>',
        '\x1b[32m\x1b[1m' + config.dbName + '\x1b[0m ',
        '\n',
        '- \x1b[30;1mTest Database: \x1b[34m>  ',
        '\x1b[32m\x1b[1m' + config.testDb + '\x1b[0m   ',
        '\n',
        '##############################',
        '\n',
        '| \x1B[3m\x1b[36mApplication is running now \x1b[0m|',
        '\n',
        '##############################'
    )
    /* eslint-enable no-console */
})

export default app
