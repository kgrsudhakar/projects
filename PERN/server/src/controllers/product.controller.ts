import { Request, Response } from 'express';
import { productService, categoryService } from '../services/product.service';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string(),
  images: z.array(z.string()),
});

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.string().optional(),
});

export const createProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const product = await productService.createProduct(validatedData);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, categoryId, skip, take } = req.query;
    const products = await productService.getAllProducts({
      search: search as string,
      categoryId: categoryId as string,
      skip: skip ? parseInt(skip as string) : undefined,
      take: take ? parseInt(take as string) : undefined,
    });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = productSchema.partial().parse(req.body);
    const product = await productService.updateProduct(req.params.id, validatedData);
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const validatedData = categorySchema.parse(req.body);
    const category = await categoryService.createCategory(validatedData);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
