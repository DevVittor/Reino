import { Router } from "express";

const router = Router();

import {
  listAdmin,
  createUser,
  loginUser,
  alterEmail,
  alterPassword,
  deleteUser,
} from "../controllers/userController.js";

router.get("/list", listAdmin);
router.post("/register", createUser);
router.post("/login", loginUser);
router.patch("/alter/email", alterEmail);
router.post("/alter/password", alterPassword);
router.delete("/delete", deleteUser);

export default router;
