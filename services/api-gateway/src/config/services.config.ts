import { config } from './index';
import { ServiceConfig } from '../types';

export const serviceRegistry: Record<string, ServiceConfig> = {
  order: {
    name: 'order-service',
    url: config.services.order,
    healthCheckPath: '/health',
    timeout: config.timeouts.proxy,
    retries: config.retry.maxAttempts
  },
  menu: {
    name: 'menu-service',
    url: config.services.menu,
    healthCheckPath: '/health',
    timeout: config.timeouts.proxy,
    retries: config.retry.maxAttempts
  },
  delivery: {
    name: 'delivery-service',
    url: config.services.delivery,
    healthCheckPath: '/health',
    timeout: config.timeouts.proxy,
    retries: config.retry.maxAttempts
  },
  payment: {
    name: 'payment-service',
    url: config.services.payment,
    healthCheckPath: '/health',
    timeout: config.timeouts.proxy,
    retries: config.retry.maxAttempts
  }
};

export function getServiceByName(name: string): ServiceConfig | undefined {
  return serviceRegistry[name];
}

export function getAllServices(): ServiceConfig[] {
  return Object.values(serviceRegistry);
}
