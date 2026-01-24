export function getAppConfig() {
  const { PORT, DATABASE_URL, API_KEY } = process.env;

  if (!PORT) {
    throw new Error('Missing required environment variable: PORT');
  }
  if (!DATABASE_URL) {
    throw new Error('Missing required environment variable: DATABASE_URL');
  }
  if (!API_KEY) {
    throw new Error('Missing required environment variable: API_KEY');
  }

  return {
    port: Number(PORT),
    databaseUrl: DATABASE_URL,
    apiKey: API_KEY,
  };
}
