import AppError from "./appError"
import { Response } from "express"

interface IError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean
  path:string;
  value:string
}
const handleCastErrorDB = (error:IError) => {
  const message = `Invaild ${error.path} ${error.value}`
  return new AppError(message, 400)
}

const sendErrorDev = (error:IError, res:Response) => {
    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack
    })
  }
  
  const sendErrorProd = (error:IError, res:Response) => {
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      })
    }
  }