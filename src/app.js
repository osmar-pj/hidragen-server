import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
require('dotenv').config()

import { createServer } from 'http'

// importamos las routes
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import dashRoutes from './routes/dash.routes'
import historicoRoutes from './routes/historico.routes'

import { createRoles } from "./libs/initialSetup"
// IMPORT MODELS

const app = express();

// config sockets
const server = createServer(app)
const socket = require('./socket')

createRoles()
//createAdmin(); // para mejorar el codigo del weon de fazt

// Middlewares
const corsOptions = {
  // origin: "http://localhost:3000"
};
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
socket.connect(server)

// Welcome Routes

// Routes
app.use('/auth/api', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/dash', dashRoutes)
app.use('/api/v1/historico', historicoRoutes)

server.listen(process.env.PORT, () => {
  console.log('server is ok')
})

export default app