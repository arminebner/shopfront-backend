import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import config from 'config'
import log from './utils/logger'
import router from './controller'
import path from 'path'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'

dotenv.config()
const app = express()

app.use('/images', express.static(path.join(__dirname, 'public', 'images')))

app.use(cors())
//app.use(helmet())

app.use(express.json())

const store = new (connectPgSimple(session))()
app.use(
  session({
    store: store,
    secret: 'myscecret',
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
)

app.use(router)

const port = config.get('port')
app.listen(port, () => {
  log.info(`App startet at http://localhost:${port}`)
})
