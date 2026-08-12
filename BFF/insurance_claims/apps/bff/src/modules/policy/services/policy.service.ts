import { PolicyRepository } from "../repositories/policy.repository.js";
// import { generatePolicyNumber } from "../../../utils/policy-number.js";
import { CreatePolicyDto } from "../dto/create-policy.dto.js";
import { NotFoundError } from "../../../errors/NotFoundError.js";
import { generatePolicyNumber } from "../../../utils/policyNumber.js";

export class PolicyService {
  private repository = new PolicyRepository();

  async create(dto: CreatePolicyDto) {
    const count = await this.repository.count();

    const policyNumber = generatePolicyNumber(count);

    return this.repository.create({
      policyNumber,
      policyType: dto.policyType,
      premiumAmount: dto.premiumAmount,
      coverageAmount: dto.coverageAmount,
      deductibleAmount: dto.deductibleAmount,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),

      customer: {
        connect: {
          id: dto.customerId,
        },
      },
    });
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ) {
    return this.repository.findAll(
      page,
      limit,
      search
    );
  }

  async findById(id: string) {
    const policy =
      await this.repository.findById(id);

    if (!policy) {
      throw new NotFoundError(
        "Policy not found"
      );
    }

    return policy;
  }

  async update(id: string, data: any) {
    await this.findById(id);

    return this.repository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);

    return this.repository.delete(id);
  }
}