import { Router } from "express";

const router = Router();

import User from "./userRoute.js";
import Product from "./productRoute.js";
import Category from "./categoryRoute.js";
import SubCategory from "./subCategoryRoute.js";

router.use("/user", User);
router.use("/product", Product);
router.use("/category", Category);
router.use("/subcategory", SubCategory);

export default router;
