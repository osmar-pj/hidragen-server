import { Router } from "express";
const router = Router();

import * as dashCtrl from "../controllers/dash.controller";
import { authJwt } from "../middlewares";

router.get('/', [authJwt.verifyToken], dashCtrl.getDataDashboard)

export default router;
