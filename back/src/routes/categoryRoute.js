import { Router } from "express";

const router = Router();

import {
  listCategory,
  createCategory,
  addCategory,
  removeCategorieFieldFromAllProducts,
  renameCategory,
  deleteCategory,
  removeSubCategoryFromCategory,
  addSubCategoryToCategory,
  removeCategory,
} from "../controllers/categoryController.js";

router.get("/list", listCategory);
router.post("/create", createCategory);
router.post("/remove", removeCategorieFieldFromAllProducts);
router.post("/add", addCategory);
router.patch("/remove", removeCategory);
router.patch("/add-subcategory", addSubCategoryToCategory);
router.patch("/remove-subcategory", removeSubCategoryFromCategory);
router.patch("/alter", renameCategory);
router.delete("/delete", deleteCategory);

export default router;
