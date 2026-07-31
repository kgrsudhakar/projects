import { productRepository, categoryRepository } from '../repositories/product.repository';

export const productService = {
  async createProduct(data: any) {
    return await productRepository.create(data);
  },
  async getAllProducts(params: any) {
    return await productRepository.findAll(params);
  },
  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  },
  async updateProduct(id: string, data: any) {
    return await productRepository.update(id, data);
  },
  async deleteProduct(id: string) {
    return await productRepository.delete(id);
  },
};

export const categoryService = {
  async createCategory(data: any) {
    return await categoryRepository.create(data);
  },
  async getAllCategories() {
    return await categoryRepository.findAll();
  },
  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new Error('Category not found');
    return category;
  },
  async updateCategory(id: string, data: any) {
    return await categoryRepository.update(id, data);
  },
  async deleteCategory(id: string) {
    return await categoryRepository.delete(id);
  },
};
