const path = require('path');
process.env.PORT = process.env.PORT || '3000';
process.env.API_KEY = process.env.API_KEY || 'test-key';
process.env.USE_IN_MEMORY = process.env.USE_IN_MEMORY || 'true';

// Change working directory to workspace root so module resolution mirrors pnpm workspace layout
process.chdir(path.join(__dirname, '..', '..'));
require(path.join(process.cwd(), 'dist', 'order', 'src', 'main.js'));
