export interface ServiceConfig {
  name: string;
  url: string;
  healthCheckPath: string;
  timeout: number;
  retries: number;
}

export interface RouteConfig {
  path: string;
  target: string;
  method?: string | string[];
  auth?: boolean;
  permissions?: string[];
}

export interface RequestWithUser extends Request {
  user?: any;
  correlationId?: string;
}
