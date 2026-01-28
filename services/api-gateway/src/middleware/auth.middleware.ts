/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export function authMiddleware(requiredPermissions?: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      (req as any).user = decoded;
      if (requiredPermissions && requiredPermissions.length > 0) {
        const userPerms = decoded.permissions || [];
        const hasPerm = requiredPermissions.every(p => userPerms.includes(p));
        if (!hasPerm) {
          return res.status(403).json({ message: 'Insufficient permissions' });
        }
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}
