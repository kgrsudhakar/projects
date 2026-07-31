import prisma from '../config/prisma';

export const productRepository = {
  async create(data: any) {
    return await prisma.product.create({ data });
  },
  async findAll(params: { skip?: number, take?: number, search?: string, categoryId?: string }) {
    const { skip, take, search, categoryId } = params;
    return await prisma.product.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ]
          } : {},
          categoryId ? { categoryId } : {},
        ]
      },
      skip,
      take,
      include: { category: true },
    }).then(products => products.map(p => ({
      ...p,
      price: p.price.toNumber()
    })));
  },
  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: true },
    });
    if (product) {
      return { ...product, price: product.price.toNumber() };
    }
    return product;
  },
  async update(id: string, data: any) {
    return await prisma.product.update({ where: { id }, data });
  },
  async delete(id: string) {
    return await prisma.product.delete({ where: { id } });
  },
};

export const categoryRepository = {
  async create(data: any) {
    return await prisma.category.create({ data });
  },
  async findAll() {
    return await prisma.category.findMany();
  },
  async findById(id: string) {
    return await prisma.category.findUnique({ where: { id } });
  },
  async update(id: string, data: any) {
    return await prisma.category.update({ where: { id }, data });
  },
  async delete(id: string) {
    return await prisma.category.delete({ where: { id } });
  },
};
