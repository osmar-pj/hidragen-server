import { Router } from "express";
const router = Router();

import * as usersCtrl from "../controllers/user.controller";
import { authJwt, verifySignup } from "../middlewares";

router.post(
  "/",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignup.checkDuplicateUsernameOrEmail
  ],
  usersCtrl.createUser
)

router.get('/:id', [authJwt.verifyToken, authJwt.isAdmin], usersCtrl.getWorker)

router.get('/', [authJwt.verifyToken, authJwt.isAdmin] ,usersCtrl.getWorkers)

router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], usersCtrl.updateWorker)

router.get('/search/:name', usersCtrl.searchWorker)

export default router;
