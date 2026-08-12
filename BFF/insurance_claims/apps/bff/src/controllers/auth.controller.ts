import { Request, Response } from "express";

import { AuthService } from "../services/auth.service.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export class AuthController {

    private service = new AuthService();

    register = async (

        req: AuthRequest,

        res: Response

    ) => {

        console.log("Request Body:", req.body);

        const user =

            await this.service.register(

                req.body

            );

        return res.status(201).json({

            success: true,

            data: user

        });

    };


//     login = async (req: AuthRequest, res: Response) => {

//     const response =
//       await this.service.login(
//         req.body.email,
//         req.body.password
//       );

//     res.cookie(
//       "refreshToken",
//       response.refreshToken,
//       {
//         httpOnly: true,
//         secure: false,      // true in production (HTTPS)
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       }
//     );

//     return res.json({
//       success: true,
//       data: {
//         user: response.user,
//         accessToken: response.accessToken,
//       }
//     });
// };

login=async(

req:AuthRequest,

res: Response

)=>{

const result=

await this.service.login(

req.body.email,

req.body.password

);

res.json(

ApiResponse.success(

"Login Successful",

result

)

);

}

refreshToken = async (req: AuthRequest, res: Response) => {

    const refreshToken =
      req.cookies.refreshToken;

    const response =
      await this.service.refreshToken(
        refreshToken
      );

    return res.json({
        success: true,
        data: response
    });

};

logout = async (
    req: AuthRequest,
    res: Response
) => {

    await this.service.logout(
        req.user!.userId
    );

    res.clearCookie("refreshToken");

    return res.json({
        success: true,
        message: "Logout successful"
    });

};

}