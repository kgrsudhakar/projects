import prisma from "../../../config/prisma.js";
import { Prisma, Policy } from "@prisma/client";

export class PolicyRepository {
  async create(data: Prisma.PolicyCreateInput): Promise<Policy> {
    return prisma.policy.create({
      data,
    });
  }

  async findById(id: string): Promise<Policy | null> {
    return prisma.policy.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });
  }

  async findByPolicyNumber(policyNumber: string) {
    return prisma.policy.findUnique({
      where: { policyNumber },
    });
  }

  async count(): Promise<number> {
    return prisma.policy.count();
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ) {
    const skip = (page - 1) * limit;

    return prisma.policy.findMany({
      skip,
      take: limit,
      where: search
        ? {
            OR: [
              {
                policyNumber: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                policyType: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(
    id: string,
    data: Prisma.PolicyUpdateInput
  ) {
    return prisma.policy.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.policy.delete({
      where: { id },
    });
  }
}