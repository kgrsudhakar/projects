import {
  APIGatewayProxyResult
} from "aws-lambda";

export function success(
  data: unknown,
  statusCode = 200
): APIGatewayProxyResult {

  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
}

export function error(
  message: string,
  statusCode = 500
): APIGatewayProxyResult {

  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message
    })
  };
}