export const getFrontendConfig = () => ({
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
});
