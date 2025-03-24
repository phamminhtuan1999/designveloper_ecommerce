import { ApiResponse } from "../interfaces/api-response.interface";

export class ResponseUtil {
  static success<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
    };
  }

  static error(message: string, errors?: any[]): ApiResponse {
    return {
      success: false,
      message,
      errors,
    };
  }
}
