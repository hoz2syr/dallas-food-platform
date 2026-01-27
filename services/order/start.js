const path = require('path');

// Ensure workspace root for module resolution
process.chdir(path.join(__dirname, '..', '..'));

// Try to load compiled config helper from packages/config (fallbacks included)
let getAppConfig = null;
try {
  // compiled helper (after packages/config build)
  getAppConfig = require('../../packages/config/dist/getAppConfig').getAppConfig
    || require('../../packages/config/dist/getAppConfig');
} catch (err) {
  try {
    // if package exports index
    const cfgPkg = require('../../packages/config/dist');
    getAppConfig = cfgPkg.getAppConfig || cfgPkg.default;
  } catch (err2) {
    // no config helper available — will fall back to env
  }
}

let cfg = { PORT: Number(process.env.PORT || 3000) };
if (typeof getAppConfig === 'function') {
  try {
    cfg = getAppConfig();
  } catch (err) {
    console.warn('packages/config getAppConfig() failed — falling back to environment variables', err);
  }
}

// Apply essential env defaults (kept for compatibility)
process.env.PORT = process.env.PORT || String(cfg.PORT || 3000);
process.env.API_KEY = process.env.API_KEY || 'test-key';
process.env.USE_IN_MEMORY = process.env.USE_IN_MEMORY || 'true';

// Require the compiled Nest application entry
const mainPath = path.join(process.cwd(), 'dist', 'order', 'src', 'main.js');
let appModule;
try {
  appModule = require(mainPath);
} catch (err) {
  console.error(`Failed to require ${mainPath}:`, err);
  process.exit(1);
}

async function run() {
  // main module may export bootstrap function or default
  const bootstrapFn = appModule.bootstrap || appModule.default || appModule;
  if (typeof bootstrapFn !== 'function') {
    console.error('Bootstrap function not found in order main module. Expected a function to initialize the Nest app.');
    process.exit(1);
  }

  try {
    const app = await bootstrapFn();

    // Enable Nest's shutdown hooks if available
    if (app && typeof app.enableShutdownHooks === 'function') {
      app.enableShutdownHooks();
    }

    console.info(JSON.stringify({ msg: 'Order service started', port: process.env.PORT }));
  } catch (err) {
    console.error('Failed to bootstrap order service:', err);
    process.exit(1);
  }
}

run();