import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, Response: any, next: () => void) {
    console.log(`Se ejecuto el controlador con el metodo${req.method} en la ruta ${req.url}`)
    next();
  }
}
export function globalLogger (req: Request, Response: any, next: () => void){
console.log(`Se ejecuto el controlador con el metodo${req.method} en la ruta ${req.url}`)
next();
}