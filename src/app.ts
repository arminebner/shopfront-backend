require('dotenv').config()
import express from 'express'
import * as bodyParser from 'body-parser'
import config from 'config'
import log from './utils/logger'
import router from './controller'

import cors from 'cors'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(router)

const port = config.get('port')
app.listen(port, () => {
  log.info(`App startet at http://localhost:${port}`)
})
