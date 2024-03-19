import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import AppError from "../util/appError";

interface IError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  path: string | undefined;
  value: string | undefined
}

const handleCastErrorDB = (error: IError) => {
  const message = `Invalid ${error.path}: ${error.value}`
  return new AppError(message, 400)
}

const sendErrorDev = (error: IError, res: Response) => {
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error: IError, res: Response) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error('Error', error);
    res.status(500).json({
      status: "Error Fucking Occured",
      message: "Something went very wrong!"
    })
  }
};

const globalErrorHandler: ErrorRequestHandler = (error: IError,req: Request,res: Response,next: NextFunction) => {
  console.log(error);

  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Error occured";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let realError = { ...error }
    if ( realError.name === 'CastError') realError = handleCastErrorDB(realError)
    sendErrorProd(realError, res);
  }
  next();
};

export default globalErrorHandler;
