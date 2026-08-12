import { prisma } from "../database/prisma.js";

import { CreateClaimRequest } from "../dto/CreateClaimRequest.js";

import { ClaimStatus } from "@prisma/client";

export class ClaimRepository {

  async create(
    data: CreateClaimRequest & {
      claimNumber: string;
    }
  ) {
    return prisma.claim.create({
      data: {
        claimNumber: data.claimNumber,

        policyId: data.policyId,

        customerId: data.customerId,

        adjusterId: data.adjusterId,

        title: data.title,

        description: data.description,

        incidentDate: new Date(
          data.incidentDate
        ),

        claimAmount: data.claimAmount,
      },

      include: {
        policy: true,

        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        adjuster: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll() {
    return prisma.claim.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        policy: true,

        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        adjuster: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.claim.findUnique({
      where: {
        id,
      },

      include: {
        policy: true,

        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        adjuster: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        documents: true,

        timeline: true,
      },
    });
  }

  async update(
    id: string,
    data: any
  ) {
    return prisma.claim.update({
      where: {
        id,
      },

      data,

      include: {
        policy: true,

        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        adjuster: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.claim.delete({
      where: {
        id,
      },
    });
  }


  async updateStatus(
  id: string,
  status: ClaimStatus,
  approvedAmount?: number
) {
  return prisma.claim.update({
    where: {
      id,
    },
    data: {
      status,

      ...(approvedAmount !== undefined
        ? {
            approvedAmount,
          }
        : {}),
    },
    include: {
      policy: true,
      customer: true,
      adjuster: true,
      documents: true,
      timeline: true,
    },
  });
}
}