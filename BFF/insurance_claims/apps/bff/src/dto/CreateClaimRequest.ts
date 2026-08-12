export interface CreateClaimRequest {
  policyId: string;

  customerId: string;

  adjusterId?: string;

  title: string;

  description: string;

  incidentDate: string;

  claimAmount: number;
}