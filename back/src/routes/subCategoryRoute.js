import { Router } from "express";

const router = Router();

import {
  listSubCategory,
  createSubCategory,
  addSubcategory,
  removeSubcategory,
  alterSubCategory,
  deleteSubCategory,
} from "../controllers/subCategoryController.js";

router.get("/list", listSubCategory);
router.post("/create", createSubCategory);
router.post("/add", addSubcategory);
router.patch("/remove", removeSubcategory);
router.patch("/alter", alterSubCategory);
router.delete("/delete", deleteSubCategory);

export default router;
