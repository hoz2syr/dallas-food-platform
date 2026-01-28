import { RouteConfig } from '../types';
import { config } from './index';

export const routes: RouteConfig[] = [
  // Order Service Routes
  {
    path: '/api/v1/orders',
    target: config.services.order,
    auth: true,
    permissions: ['order:read', 'order:create']
  },
  {
    path: '/api/v1/orders/:id',
    target: config.services.order,
    auth: true,
    permissions: ['order:read']
  },
  
  // Menu Service Routes
  {
    path: '/api/v1/menu',
    target: config.services.menu,
    auth: false // Public access for browsing menu
  },
  {
    path: '/api/v1/menu/items',
    target: config.services.menu,
    method: ['GET'],
    auth: false
  },
  {
    path: '/api/v1/menu/items',
    target: config.services.menu,
    method: ['POST', 'PUT', 'DELETE'],
    auth: true,
    permissions: ['menu:write']
  },
  {
    path: '/api/v1/menu/restaurants/:id',
    target: config.services.menu,
    auth: false
  },
  
  // Delivery Service Routes
  {
    path: '/api/v1/delivery',
    target: config.services.delivery,
    auth: true,
    permissions: ['delivery:read']
  },
  {
    path: '/api/v1/delivery/orders/:orderId',
    target: config.services.delivery,
    auth: true,
    permissions: ['delivery:read']
  },
  {
    path: '/api/v1/delivery/assign',
    target: config.services.delivery,
    method: ['POST'],
    auth: true,
    permissions: ['delivery:assign']
  },
  
  // Payment Service Routes
  {
    path: '/api/v1/payments',
    target: config.services.payment,
    auth: true,
    permissions: ['payment:create']
  },
  {
    path: '/api/v1/payments/intents',
    target: config.services.payment,
    method: ['POST'],
    auth: true,
    permissions: ['payment:create']
  },
  {
    path: '/api/v1/payments/confirm',
    target: config.services.payment,
    method: ['POST'],
    auth: true,
    permissions: ['payment:create']
  }
];

export function getRouteConfig(path: string, method?: string): RouteConfig | undefined {
  return routes.find(route => {
    const pathMatches = route.path === path || 
                        new RegExp('^' + route.path.replace(/:\w+/g, '\\w+') + '$').test(path);
    
    if (!pathMatches) return false;
    
    if (route.method) {
      if (Array.isArray(route.method)) {
        return route.method.includes(method || 'GET');
      }
      return route.method === method;
    }
    
    return true;
  });
}
