import {
  APIGatewayProxyHandler
} from "aws-lambda";

import {
  PutObjectCommand
} from "@aws-sdk/client-s3";

import {
  getSignedUrl
} from "@aws-sdk/s3-request-presigner";

import {
  s3Client
} from "../clients/s3.client.js";

import {
  success,
  error
} from "../utils/response.js";

export const handler:
  APIGatewayProxyHandler =
  async (event) => {

    try {

      const fileName =
        event.queryStringParameters
          ?.fileName;

      if (!fileName) {
        return error(
          "fileName is required",
          400
        );
      }

      const command =
        new PutObjectCommand({
          Bucket:
            process.env.ORDER_BUCKET!,
          Key: `uploads/${fileName}`
        });

      const uploadUrl =
        await getSignedUrl(
          s3Client,
          command,
          {
            expiresIn: 300
          }
        );

      return success({
        uploadUrl
      });

    } catch (err) {

      console.error(
        "Upload URL generation failed",
        err
      );

      return error(
        "Unable to generate upload URL",
        500
      );
    }
  };