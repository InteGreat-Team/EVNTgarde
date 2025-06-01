import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      body: any;
    }
  }
}

export interface CustomRequest<T = any> extends Request {
  body: T;
}

export interface CustomResponse extends Response {}