const fs = require('fs');
const path = require('path');

// ── ENV CONFIGURATION MAP ──────────────────────────────────────────────────
// Maps Firebase config keys to environment variable names.
const firebaseKeys = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Validate that critical env variables are provided
if (!firebaseKeys.apiKey || !firebaseKeys.projectId) {
  console.error("❌ Error: FIREBASE_API_KEY and FIREBASE_PROJECT_ID env variables must be set!");
  process.exit(1);
}

// Generate the configuration block string
const configBlock = `const firebaseConfig = {
  apiKey: "${firebaseKeys.apiKey}",
  authDomain: "${firebaseKeys.authDomain || ''}",
  projectId: "${firebaseKeys.projectId}",
  storageBucket: "${firebaseKeys.storageBucket || ''}",
  messagingSenderId: "${firebaseKeys.messagingSenderId || ''}",
  appId: "${firebaseKeys.appId || ''}",
  measurementId: "${firebaseKeys.measurementId || ''}"
};`;

const filesToInject = [
  {
    path: path.join(__dirname, 'js', 'assessment.js'),
    pattern: /const\s+firebaseConfig\s*=\s*\{[\s\S]*?\};/
  },
  {
    path: path.join(__dirname, 'dashboard.html'),
    pattern: /const\s+firebaseConfig\s*=\s*\{[\s\S]*?\};/
  }
];

filesToInject.forEach(fileInfo => {
  if (fs.existsSync(fileInfo.path)) {
    let content = fs.readFileSync(fileInfo.path, 'utf8');
    if (fileInfo.pattern.test(content)) {
      content = content.replace(fileInfo.pattern, configBlock);
      fs.writeFileSync(fileInfo.path, content, 'utf8');
      console.log(`✅ Injected Firebase config successfully into: ${path.basename(fileInfo.path)}`);
    } else {
      console.warn(`⚠️ Could not find firebaseConfig declaration pattern in: ${path.basename(fileInfo.path)}`);
    }
  } else {
    console.error(`❌ File not found: ${fileInfo.path}`);
  }
});
