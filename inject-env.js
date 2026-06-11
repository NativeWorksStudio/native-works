const fs = require('fs');
const path = require('path');

// Load .env manually if it exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

// Helper to recursively copy directories
function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

console.log("🚀 Starting build-time environment variable injection...");

// ── ENV CONFIGURATION MAP ──────────────────────────────────────────────────
const firebaseKeys = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Validate critical keys
if (!firebaseKeys.apiKey || !firebaseKeys.projectId) {
  console.error("❌ Error: FIREBASE_API_KEY and FIREBASE_PROJECT_ID env variables must be set!");
  process.exit(1);
}

// Generate the configuration block
const configBlock = `const firebaseConfig = {
  apiKey: "${firebaseKeys.apiKey}",
  authDomain: "${firebaseKeys.authDomain || ''}",
  projectId: "${firebaseKeys.projectId}",
  storageBucket: "${firebaseKeys.storageBucket || ''}",
  messagingSenderId: "${firebaseKeys.messagingSenderId || ''}",
  appId: "${firebaseKeys.appId || ''}",
  measurementId: "${firebaseKeys.measurementId || ''}"
};`;

// Define the public output folder for Vercel
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Copy all static files & folders from the root to public
const filesToCopy = [
  'index.html',
  'products.html',
  'creator.html',
  'assessment.html',
  'creator-assessment.html',
  'contact.html',
  'thank-you.html',
  'dashboard.html',
  'business.html',
  'business-ceo-assessment.html',
  'business-cto-assessment.html',
  'NativeWorks_Brand_Identity_v1.html',
  'NativeWorks_Canela_Licence_Brief_v1_0.html',
  'NativeWorks_MainPage_v1.html',
  'robots.txt',
  'sitemap.xml',
  'favicon.svg',
  'og-image.png',
  'llms.txt'
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, file));
  }
});

// Copy directories
copyFolderSync(path.join(__dirname, 'css'), path.join(publicDir, 'css'));
copyFolderSync(path.join(__dirname, 'js'), path.join(publicDir, 'js'));

console.log("✅ Successfully copied all static assets to the 'public' directory.");

// 2. Inject Firebase credentials into the copied files in 'public'
const filesToInject = [
  {
    path: path.join(publicDir, 'js', 'assessment.js'),
    pattern: /const\s+firebaseConfig\s*=\s*\{[\s\S]*?\};/
  },
  {
    path: path.join(publicDir, 'js', 'business-ceo-assessment.js'),
    pattern: /const\s+firebaseConfig\s*=\s*\{[\s\S]*?\};/
  },
  {
    path: path.join(publicDir, 'js', 'business-cto-assessment.js'),
    pattern: /const\s+firebaseConfig\s*=\s*\{[\s\S]*?\};/
  },
  {
    path: path.join(publicDir, 'dashboard.html'),
    pattern: /const\s+firebaseConfig\s*=\s*\{[\s\S]*?\};/
  }
];

filesToInject.forEach(fileInfo => {
  if (fs.existsSync(fileInfo.path)) {
    let content = fs.readFileSync(fileInfo.path, 'utf8');
    if (fileInfo.pattern.test(content)) {
      content = content.replace(fileInfo.pattern, configBlock);
      fs.writeFileSync(fileInfo.path, content, 'utf8');
      console.log(`✅ Injected Firebase config successfully into: public/${path.basename(fileInfo.path)}`);
    } else {
      console.warn(`⚠️ Could not find firebaseConfig declaration pattern in: public/${path.basename(fileInfo.path)}`);
    }
  } else {
    console.error(`❌ File not found: ${fileInfo.path}`);
  }
});

console.log("🎉 Build completed successfully!");
