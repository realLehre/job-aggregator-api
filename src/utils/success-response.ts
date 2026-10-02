import { Response } from "express";

interface SuccessResponseOptions {
  res: Response;
  statusCode?: number;
  responseData?: any;
  message?: string;
}

const successResponse = ({
  res,
  statusCode = 200,
  responseData,
  message = "Item fetched successfully",
}: SuccessResponseOptions) => {
  return res.status(statusCode).json({
    status: "success",
    responseData,
    message,
  });
};

export default successResponse;
