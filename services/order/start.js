const path = require('path');
const { execSync } = require('child_process');

async function run() {
  try {
    const mainPath = path.join(__dirname, 'dist', 'services', 'order', 'src', 'main.js');
    
    // تحقق من وجود الملف
    const fs = require('fs');
    if (!fs.existsSync(mainPath)) {
      console.error('Built file not found:', mainPath);
      console.log('Building...');
      execSync('pnpm build', { stdio: 'inherit' });
    }

    // تحميل الملف المبنى
    const appModule = require(mainPath);
    
    // الحالة 1: الملف يُصدّر bootstrap
    if (typeof appModule.bootstrap === 'function') {
      console.log('Starting via bootstrap export...');
      await appModule.bootstrap();
    }
    // الحالة 2: الملف يُصدّر كـ default
    else if (typeof appModule.default === 'function') {
      console.log('Starting via default export...');
      await appModule.default();
    }
    // الحالة 3: الملف لا يُصدّر أي شيء (يستدعي bootstrap مباشرة)
    else {
      console.log('Service already started via direct execution');
      // الخدمة بدأت بالفعل، ابقى قيد التشغيل
      setInterval(() => {}, 1000);
    }

    console.info(JSON.stringify({ 
      msg: 'Order service started', 
      port: process.env.PORT || 3000 
    }));
  } catch (err) {
    console.error('Failed to start order service:', err);
    process.exit(1);
  }
}

run();
