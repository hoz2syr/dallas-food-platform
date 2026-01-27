// Entry point for the order service
import { getAppConfig } from '../../../packages/config/src/getAppConfig';

const appConfig = getAppConfig();

console.log('Order service started with config:', appConfig);
