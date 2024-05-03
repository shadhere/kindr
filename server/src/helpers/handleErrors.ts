import { Request, Response, NextFunction } from "express";

const handleErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status: number = err.status || 500;
  const message: string = err.message;
  const data: any = err.data;

  res.status(status).json({
    "custom error data from handleErrors data :": data,
    "custom error message from handleErrors message :": message,
  });
};

export default handleErrors;
