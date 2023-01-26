require('dotenv').config()
import express, { json } from 'express'
import config from 'config'
import log from './utils/logger'
import router from './controller'

const cors = require('cors')

const app = express()

app.use(cors())
app.use(json())
app.use(router)

const port = config.get('port')
app.listen(port, () => {
  log.info(`App startet at http://localhost:${port}`)
})
