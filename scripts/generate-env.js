const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
const envExamplePath = path.join(root, '.env.example');

let env;

if (fs.existsSync(envPath)) {
  env = dotenv.parse(fs.readFileSync(envPath));
  console.log('Using .env file');
} else if (fs.existsSync(envExamplePath)) {
  env = dotenv.parse(fs.readFileSync(envExamplePath));
  console.log('.env not found, falling back to .env.example');
} else {
  env = {};
  console.log('No .env or .env.example found, using defaults');
}

const supabaseUrl = env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.SUPABASE_ANON_KEY || 'placeholder-key';
const apiUrl = env.API_URL || 'http://localhost:8080/api';

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
  apiUrl: '/api',
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
