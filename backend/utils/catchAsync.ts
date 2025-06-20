import { Request, Response, NextFunction, RequestHandler } from "express";

const catchAsync = (fn: Function): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;