import { prisma } from "../database/prisma.js";

import { RegisterRequest } from "../dto/RegisterRequest.js";

export class UserRepository {

    async create(data: RegisterRequest) {
        return prisma.user.create({data});
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

    async updateLastLogin(id: string) {

    return prisma.user.update({
        where: {id},
        data: {lastLogin: new Date()}
    });
}
}