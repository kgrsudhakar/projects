export interface CreatePolicyDto {
  customerId: string;

  policyType: "AUTO" | "HEALTH" | "HOME" | "LIFE" | "TRAVEL";

  premiumAmount: number;

  coverageAmount: number;

  deductibleAmount: number;

  startDate: string;

  endDate: string;
}