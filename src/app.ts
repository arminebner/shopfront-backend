require('dotenv').config()
import express from 'express'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import config from 'config'
import log from './utils/logger'
import errorHandler from './middleware/errorHandler'
import router from './controller'
import path from 'path'

const app = express()

app.use('/images', express.static(path.join(__dirname, 'public', 'images')))
app.use(cors())
app.use(helmet())
//app.use(errorHandler)
app.use(bodyParser.json())
app.use(router)

const port = config.get('port')
app.listen(port, () => {
  log.info(`App startet at http://localhost:${port}`)
})
