import { Router } from "express"
const router = Router()

import * as historicoCtrl from "../controllers/historico.controller"
import { authJwt } from "../middlewares"

router.get('/', [authJwt.verifyToken], historicoCtrl.getDataWeek)

export default router
