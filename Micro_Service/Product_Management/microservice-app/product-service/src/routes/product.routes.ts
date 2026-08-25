import { Router } from "express";

import {
  fetchProducts,
  fetchProductById,
  addProduct,
  deleteProduct,
} from "../controllers/product.controller";

const router = Router();

router.get("/", fetchProducts);

router.get("/:id", fetchProductById);

router.post("/", addProduct);

router.delete('/:id', deleteProduct)

export default router;