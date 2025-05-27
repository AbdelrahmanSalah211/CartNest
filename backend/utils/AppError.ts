import { Request, Response, NextFunction } from 'express';

interface TokenMetadata {
  tokenType: string;
  errorType: 'invalid' | 'expired';
}

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  tokenMetadata?: TokenMetadata;
  constructor(message: string, statusCode: number, tokenMetadata: TokenMetadata | null = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    if (tokenMetadata) {
      this.tokenMetadata = tokenMetadata;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

// const handleCastErrorDB = (err: any): AppError => {
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   return new AppError(message, 400);
// };

const handleDuplicateFieldsDB = (err: any): AppError => {
  const field: string[] = err.detail.match(/Key \((.+?)\)=\((.+?)\)/);
  const message = `${field[1]}: ${field[2]} already in use. please choose another`;
  return new AppError(message, 400);
};

// const handleValidationErrorDB = (err: any): AppError => {
//   const errors = Object.values(err.errors).map((el: any) => el.message);
//   const message = `Invalid input data. ${errors.join('. ')}`;
//   return new AppError(message, 400);
// };

const handleJWTError = (tokenType: string = 'token'): AppError => 
  new AppError(`Invalid ${tokenType}.`, 401, { tokenType, errorType: 'invalid' });

const handleJWTExpiredError = (tokenType: string = 'token'): AppError => 
  new AppError(`${tokenType} has expired.`, 401, { tokenType, errorType: 'expired' });

const sendError = (err: any, res: Response): void => {
  if (err.isOperational) {
    const responseObj: any = {
      status: err.status,
      message: err.message,
    };

    if (err.tokenMetadata) {
      responseObj.auth = {
        tokenType: err.tokenMetadata.tokenType,
        errorType: err.tokenMetadata.errorType
      };
    }

    res.status(err.statusCode).json(responseObj);
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

function determineTokenType(req: Request): string {
  if (req.path.includes('/refresh') || req.path.includes('/token/refresh')) {
    return 'refresh token';
  }
  return 'access token';
}

export const globalErrorHandling = (err: any, req: Request, res: Response, next: NextFunction): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error: any = Object.create(Object.getPrototypeOf(err));
  Object.assign(error, err);

  error.message = err.message;
  error.tokenMetadata = err.tokenMetadata;

  const tokenType = determineTokenType(req);
  
    // if (error.name === "CastError") {
    //   error = handleCastErrorDB(error);
    // }
    if (error.code === '23505') {
    error = handleDuplicateFieldsDB(error);
  }
  // if (error.name === "ValidationError") {
  //   error = handleValidationErrorDB(error);
  // }
  if (error.name === "JsonWebTokenError") {
    error = handleJWTError(tokenType);
  }
  if (error.name === "TokenExpiredError") {
    error = handleJWTExpiredError(tokenType);
  }
  sendError(error, res);
};