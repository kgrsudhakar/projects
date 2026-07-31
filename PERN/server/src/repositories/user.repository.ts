import prisma from '../config/prisma';

export const userRepository = {
  async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  },
  async findUnique(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  },
  async create(data: any) {
    return await prisma.user.create({ data });
  },
  async update(id: string, data: any) {
    return await prisma.user.update({ where: { id }, data });
  },
  async delete(id: string) {
    return await prisma.user.delete({ where: { id } });
  },
  async findAll() {
    return await prisma.user.findMany();
  },
};
