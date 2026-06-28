const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
const envExamplePath = path.join(root, '.env.example');

let fileEnv = {};

if (fs.existsSync(envPath)) {
  fileEnv = dotenv.parse(fs.readFileSync(envPath));
  console.log('Using .env file');
} else if (fs.existsSync(envExamplePath)) {
  fileEnv = dotenv.parse(fs.readFileSync(envExamplePath));
  console.log('.env not found, falling back to .env.example');
} else {
  console.log('No .env or .env.example found, using defaults');
}

// process.env takes precedence (Vercel injects vars this way)
const supabaseUrl = process.env.SUPABASE_URL || fileEnv.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || fileEnv.SUPABASE_ANON_KEY || 'placeholder-key';
const apiUrl = process.env.API_URL || fileEnv.API_URL || 'http://localhost:8080/api';

const environmentContent = `export const environment = {
  production: false,
  apiUrl: '${apiUrl}',
  supabase: {
    url: '${supabaseUrl}',
    anonKey: '${supabaseAnonKey}',
    bucket: 'profile-images',
  },
};
`;

const environmentProdContent = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  supabase: {
    url: '${supabaseUrl}',
    anonKey: '${supabaseAnonKey}',
    bucket: 'profile-images',
  },
};
`;

const envDevPath = path.join(root, 'src', 'app', 'environments', 'environment.ts');
const envProdPath = path.join(root, 'src', 'app', 'environments', 'environment.prod.ts');

const envDir = path.dirname(envDevPath);
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

fs.writeFileSync(envDevPath, environmentContent);
fs.writeFileSync(envProdPath, environmentProdContent);

console.log('Environment files generated');
