export type AppConfig = {
  PORT: number;
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  SERVICE_NAME?: string;
  LOG_LEVEL?: string;
};

function required(name: string, v?: string): string {
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v!;
}

export function getAppConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const NODE_ENV = (env.NODE_ENV as AppConfig['NODE_ENV']) || 'development';
  const PORT = Number(env.PORT || 3000);
  if (Number.isNaN(PORT) || PORT <= 0) {
    throw new Error('Invalid or missing PORT env var');
  }
  const DATABASE_URL = required('DATABASE_URL', env.DATABASE_URL);
  const SERVICE_NAME = env.SERVICE_NAME;
  const LOG_LEVEL = (env.LOG_LEVEL as AppConfig['LOG_LEVEL']) || 'info';

  return {
    PORT,
    DATABASE_URL,
    NODE_ENV,
    SERVICE_NAME,
    LOG_LEVEL,
  };
}