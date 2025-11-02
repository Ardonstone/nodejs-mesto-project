export interface IAppError extends Error {
  statusCode?: number;
}

class AppError extends Error implements IAppError {
  public statusCode: number;

  constructor(message: string, status: number) {
    super(message);
    this.statusCode = status;
  }
}

export default AppError;