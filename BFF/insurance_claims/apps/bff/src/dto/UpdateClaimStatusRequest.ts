import {  ClaimStatus,} from "@prisma/client";

export interface UpdateClaimStatusRequest {
  status: ClaimStatus;
  approvedAmount?: number;
}