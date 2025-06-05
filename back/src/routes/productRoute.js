import { Router } from "express";

const router = Router();
import multer from "multer";

import {
  countProduct,
  createProduct,
  listProducts,
  myProductsUnlocks,
  featuredProducts,
  listFeaturedProducts,
  deleteProduct,
  updateProduct,
  allProducts,
} from "../controllers/productController.js";

// Configuração do Multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter: (req, file, cb) => {
    console.log(`Mimetype do arquivo: ${file.mimetype}`); // Log para debug
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new Error("Apenas imagens são permitidas (ex.: JPG, PNG, etc.)")
      );
    }
    cb(null, true);
  },
}).array("photos", 3);

// Middleware para tratar erros do Multer
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: "Erro no upload",
      details: err.message,
    });
  } else if (err) {
    return res.status(400).json({
      error: "Erro no upload",
      details: err.message,
    });
  }
  next();
};

router.post(
  "/create",
  upload,
  multerErrorHandler,
  (req, res, next) => {
    console.log("Requisição recebida em /create:", {
      method: req.method,
      body: req.body,
      files: req.files,
      headers: req.headers,
    });
    next();
  },
  createProduct
);
router.get("/mylist", allProducts);
router.get("/list", listProducts);
router.get("/list/unlocks", myProductsUnlocks);
router.post("/featured", featuredProducts);
router.patch(
  "/update",
  upload,
  multerErrorHandler,
  (req, res, next) => {
    console.log("Requisição recebida em /update:", {
      method: req.method,
      body: req.body,
      files: req.files,
      headers: req.headers,
    });
    next();
  },
  updateProduct
);

router.get("/list/featured", listFeaturedProducts);
router.get("/count", countProduct);
router.delete("/delete", deleteProduct);

export default router;
