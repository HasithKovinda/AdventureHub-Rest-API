class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "success";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);

    this.name = "AppError";
  }
}

export default AppError;
