"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const successResponse = ({ res, statusCode = 200, responseData, message = "Item fetched successfully", }) => {
    return res.status(statusCode).json({
        status: "success",
        responseData,
        message,
    });
};
exports.default = successResponse;
