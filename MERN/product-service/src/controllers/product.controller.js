import { productService } from "../services/product.service.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * CONTROLLER LAYER
 * ----------------
 * Controllers ONLY translate HTTP <-> service calls: read req, call
 * service, shape the response. No business logic here - if you find
 * yourself writing an `if` that checks business rules, it belongs in
 * the service layer instead.
 */
export const productController = {
  list: asyncHandler(async (req, res) => {
    const { category } = req.query;
    const products = await productService.listProducts({ category });
    res.json({ data: products });
  }),

  getById: asyncHandler(async (req, res) => {
    const product = await productService.getProduct(req.params.id);
    res.json({ data: product });
  }),

  create: asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ data: product });
  }),

  update: asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ data: product });
  }),

  remove: asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  }),

  reserveStock: asyncHandler(async (req, res) => {
    const product = await productService.reserveStock(req.params.id, req.body.quantity);
    res.json({ data: product });
  }),
};
