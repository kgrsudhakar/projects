import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

export const health = (

    req: Request,

    res: Response

) => {

    return res.json(

        ApiResponse.success(

            "Insurance BFF Running",

            {

                uptime: process.uptime(),

                timestamp: new Date(),

                environment: process.env.NODE_ENV

            }

        )

    );

};