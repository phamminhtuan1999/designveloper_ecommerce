export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    msg: string;
    param?: string;
    location?: string;
  }>;
}
