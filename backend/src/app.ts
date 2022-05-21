import express, {Application} from 'express'
import cors from 'cors'
import http, {Server} from 'http'
import socketConnection from './sockets'

const app : Application = express()
app.use(cors())

const server : Server = http.createServer(app)

socketConnection(server)

export default server


