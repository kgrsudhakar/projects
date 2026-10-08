export type ClaimStatus =
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected";

export interface Claim {
  id: string;
  policyNumber: string;
  customer: string;
  type: "Health" | "Auto" | "Home";
  amount: number;
  status: ClaimStatus;
  submittedDate: string;
  description: string;
}
