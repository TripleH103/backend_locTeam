class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    path: string | undefined;
    value: string | undefined
    
    constructor(message: string | undefined, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Failed' : 'Error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
export default AppError;