require('dotenv').config()
import express from 'express'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import config from 'config'
import log from './utils/logger'
import errorHandler from './middleware/errorHandler'
import router from './controller'

const app = express()
app.use(helmet())
//app.use(errorHandler)
app.use(cors())
app.use(bodyParser.json())
app.use(router)

const port = config.get('port')
app.listen(port, () => {
  log.info(`App startet at http://localhost:${port}`)
})
