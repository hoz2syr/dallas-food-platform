import { Router, Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { routes } from '../config/routes.config';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Dynamic proxy for all configured routes
routes.forEach(route => {
  const methods = route.method ? (Array.isArray(route.method) ? route.method : [route.method]) : ['GET'];
  methods.forEach(method => {
    (router as any)[method.toLowerCase()](route.path, 
      route.auth ? authMiddleware(route.permissions) : (req: Request, res: Response, next: NextFunction) => next(),
      createProxyMiddleware({
        target: route.target,
        changeOrigin: true,
        pathRewrite: (path, req) => {
          // Remove /api/v1 prefix for backend
          return path.replace(/^\/api\/v1/, '');
        },
        onProxyReq: (proxyReq, req: any) => {
          // Forward user info if available
          if (req.user) {
            proxyReq.setHeader('X-User-Id', req.user.sub);
            proxyReq.setHeader('X-User-Roles', req.user.roles?.join(','));
            proxyReq.setHeader('X-Correlation-Id', req.correlationId);
          }
        }
      })
    );
  });
});

export default router;
