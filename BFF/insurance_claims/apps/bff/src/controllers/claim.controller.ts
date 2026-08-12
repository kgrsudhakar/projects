import { Request, Response } from "express";

import { ClaimService } from "../services/claim.service.js";
import { UpdateClaimStatusRequest } from "../dto/UpdateClaimStatusRequest.js";
import { ClaimStatus } from "@prisma/client";

interface ClaimParams {
    id: string;
}

export class ClaimController {

    private service = new ClaimService();

    create = async (
        req: Request,
        res: Response
    ) => {

        const claim =
            await this.service.create(
                req.body
            );

        return res.status(201).json({
            success: true,
            message: "Claim created successfully",
            data: claim,
        });
    };


    getAll = async (
        req: Request,
        res: Response
    ) => {

        const claims =
            await this.service.findAll();

        return res.json({
            success: true,
            message: "Claims retrieved successfully",
            data: claims,
        });
    };


    getById = async (
        req: Request,
        res: Response
    ) => {

        const id = req.params.id;

        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid claim ID",
            });
        }

        const claim =
            await this.service.findById(id);

        return res.json({
            success: true,
            message: "Claim retrieved successfully",
            data: claim,
        });
    };


    update = async (
        req: Request,
        res: Response
    ) => {

        const id = req.params.id;

        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid claim ID",
            });
        }

        const claim =
            await this.service.update(
                id,
                req.body
            );

        return res.json({
            success: true,
            message: "Claim updated successfully",
            data: claim,
        });
    };


    delete = async (
        req: Request,
        res: Response
    ) => {

        const id = req.params.id;

        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid claim ID",
            });
        }

        const result =
            await this.service.delete(id);

        return res.json({
            success: true,
            ...result,
        });
    };


    /**
     * UPDATE CLAIM STATUS
     */
    // updateStatus = async (
    //     req: Request<
    //         ClaimParams,
    //         any,
    //         UpdateClaimStatusRequest
    //     >,
    //     res: Response
    // ) => {

    //     const {
    //         status,
    //         approvedAmount,
    //     } = req.body;


    //     /**
    //      * Validate status
    //      */
    //     if (!status) {

    //         return res.status(400).json({

    //             success: false,

    //             message:
    //                 "Status is required",

    //         });

    //     }


    //     /**
    //      * Validate enum value
    //      */
    //     if (
    //         !Object.values(
    //             ClaimStatus
    //         ).includes(status)
    //     ) {

    //         return res.status(400).json({

    //             success: false,

    //             message:
    //                 `Invalid claim status: ${status}`,

    //         });

    //     }


    //     const result =
    //         await this.service.updateStatus(

    //             req.params.id,

    //             status,

    //             approvedAmount !== undefined
    //                 ? Number(approvedAmount)
    //                 : undefined

    //         );


    //     return res.json({

    //         success: true,

    //         message:
    //             "Claim status updated successfully",

    //         data: result,

    //     });

    // };

     // UPDATE CLAIM STATUS
  updateStatus = async (
  req: Request,
  res: Response
) => {

  const { id } = req.params;

  // TypeScript narrowing
  if (typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid claim ID",
    });
  }

  const {
    status,
    approvedAmount,
  } = req.body as UpdateClaimStatusRequest;


  // Validate status
  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }


  // Validate ClaimStatus enum
  if (
    !Object.values(ClaimStatus).includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message: `Invalid claim status: ${status}`,
    });
  }


  const result =
    await this.service.updateStatus(
      id,
      status,
      approvedAmount !== undefined
        ? Number(approvedAmount)
        : undefined
    );


  return res.json({
    success: true,
    message: "Claim status updated successfully",
    data: result,
  });
};
}