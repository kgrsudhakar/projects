export interface UpdatePolicyDto {
  policyType?: "AUTO" | "HEALTH" | "HOME" | "LIFE" | "TRAVEL";

  premiumAmount?: number;

  coverageAmount?: number;

  deductibleAmount?: number;

  startDate?: string;

  endDate?: string;

  status?: "ACTIVE" | "EXPIRED" | "PENDING" | "CANCELLED";
}