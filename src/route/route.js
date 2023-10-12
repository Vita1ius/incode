import { Router } from "express";
const router = Router();
import * as userController from '../controller/user.controller.js';
import { authenticated } from "../middleware/auth.middleware.js";

router.post('/user/sighup', userController.createUser)
router.post('/user/login', userController.login)
router.get('/users',authenticated, userController.getUsersByRole)
router.post('/user/changeUserBoss',authenticated, userController.changeUserBoss)
export default router;