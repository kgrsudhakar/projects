import { z } from "zod";

export const createPolicySchema = z.object({

    customerId: z.string().uuid(),

    policyType: z.enum([
        "AUTO",
        "HEALTH",
        "HOME",
        "LIFE",
        "TRAVEL"
    ]),

    premiumAmount: z.number().positive(),

    coverageAmount: z.number().positive(),

    deductibleAmount: z.number().nonnegative(),

    startDate: z.string(),

    endDate: z.string()

}).refine(

(data)=>data.coverageAmount>data.premiumAmount,

{
    message:"Coverage amount must be greater than premium amount",
    path:["coverageAmount"]
}

);