import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import config from 'config'
import log from './utils/logger'
import router from './controller'
import path from 'path'
import cookieParser from 'cookie-parser'
import corsOptions from '../config/corsOptions'
import credentials from './middleware/credentials'
import sanitize from './middleware/sanitize'

dotenv.config()
const app = express()

app.use('/images', express.static(path.join(__dirname, 'public', 'images')))

app.use(credentials)
app.use(cors(corsOptions))

app.use(helmet())

app.use(express.json())
app.use(cookieParser())

app.use(sanitize)
app.use(router)

const port = config.get('port')
app.listen(port, () => {
  log.info(`App startet at http://localhost:${port}`)
})
