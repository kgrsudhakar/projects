import { Request, Response } from "express";
import { PolicyService } from "../services/policy.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";


interface PolicyParams {
  id: string;
}

export class PolicyController {
  private service = new PolicyService();

  create = async (req: Request, res: Response) => {
    const policy = await this.service.create(req.body);

    return res.status(201).json(
      ApiResponse.success(
        "Policy created successfully",
        policy
      )
    );
  };

  getAll = async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = req.query.search as string | undefined;

    const policies = await this.service.findAll(
      page,
      limit,
      search
    );

    return res.json(
      ApiResponse.success(
        "Policies retrieved successfully",
        policies
      )
    );
  };

  getById = async (req: Request<PolicyParams>, res: Response) => {
    const policy = await this.service.findById(
      req.params.id
    );

    return res.json(
      ApiResponse.success(
        "Policy retrieved successfully",
        policy
      )
    );
  };

  update = async (req: Request<PolicyParams>, res: Response) => {
    const policy = await this.service.update(
      req.params.id,
      req.body
    );

    return res.json(
      ApiResponse.success(
        "Policy updated successfully",
        policy
      )
    );
  };

  delete = async (req: Request<PolicyParams>, res: Response) => {
    await this.service.delete(req.params.id);

    return res.json(
      ApiResponse.success(
        "Policy deleted successfully"
      )
    );
  };
}