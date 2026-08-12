import { ClaimRepository } from "../repositories/claim.repository.js";

import { CreateClaimRequest } from "../dto/CreateClaimRequest.js";

import { ClaimStatus } from "@prisma/client";


export class ClaimService {

  private repository =
    new ClaimRepository();

  async create(
    request: CreateClaimRequest
  ) {

    const claimNumber =
      await this.generateClaimNumber();

    return this.repository.create({
      ...request,
      claimNumber,
    });
  }

  async findAll() {

    return this.repository.findAll();
  }

  async findById(id: string) {

    const claim =
      await this.repository.findById(id);

    if (!claim) {
      throw new Error(
        "Claim not found"
      );
    }

    return claim;
  }

  async update(
    id: string,
    data: any
  ) {

    await this.findById(id);

    return this.repository.update(
      id,
      data
    );
  }

  async delete(id: string) {

    await this.findById(id);

    await this.repository.delete(id);

    return {
      message:
        "Claim deleted successfully",
    };
  }

  private async generateClaimNumber() {

    const year =
      new Date().getFullYear();

    const claims =
      await this.repository.findAll();

    const number =
      claims.length + 1;

    return `CLM-${year}-${String(
      number
    ).padStart(6, "0")}`;
  }

  /**
   * Update Claim Status
   */
  async updateStatus(
    id: string,
    status: ClaimStatus,
    approvedAmount?: number
  ) {

    const claim =
      await this.repository.findById(
        id
      );


    if (!claim) {

      throw new Error(
        "Claim not found"
      );

    }


    const currentStatus =
      claim.status;


    /**
     * Allowed status transitions
     */
    const allowedTransitions:
      Record<
        ClaimStatus,
        ClaimStatus[]
      > = {

      DRAFT: [
        ClaimStatus.SUBMITTED,
      ],

      SUBMITTED: [
        ClaimStatus.ASSIGNED,
      ],

      ASSIGNED: [
        ClaimStatus.UNDER_REVIEW,
      ],

      UNDER_REVIEW: [
        ClaimStatus.APPROVED,
        ClaimStatus.REJECTED,
      ],

      APPROVED: [
        ClaimStatus.PAYMENT_PENDING,
      ],

      REJECTED: [],

      PAYMENT_PENDING: [
        ClaimStatus.PAID,
      ],

      PAID: [
        ClaimStatus.CLOSED,
      ],

      CLOSED: [],

    };


    const allowedStatuses =
      allowedTransitions[
        currentStatus
      ];


    /**
     * Check transition
     */
    if (
      !allowedStatuses.includes(
        status
      )
    ) {

      throw new Error(
        `Cannot change claim status from ${currentStatus} to ${status}`
      );

    }


    /**
     * Validate approved amount
     */
    if (
      status === ClaimStatus.APPROVED
    ) {

      if (
        approvedAmount === undefined
      ) {

        throw new Error(
          "Approved amount is required when approving a claim"
        );

      }


      if (
        approvedAmount <= 0
      ) {

        throw new Error(
          "Approved amount must be greater than zero"
        );

      }


      if (
        approvedAmount >
        Number(claim.claimAmount)
      ) {

        throw new Error(
          "Approved amount cannot exceed claim amount"
        );

      }

    }


    /**
     * Don't allow approved amount
     * when moving to other statuses
     * unless it was already provided.
     */

    return this.repository.updateStatus(
      id,
      status,
      approvedAmount
    );

  }
}