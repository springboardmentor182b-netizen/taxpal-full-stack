// src/types/express/index.d.ts
import "express";
import { Server } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      io?: Server;
    }
  }
}
export {}