const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '..', '.env');
const env = dotenv.parse(fs.readFileSync(envPath));

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

const envDevPath = path.join(__dirname, '..', 'src', 'app', 'environments', 'environment.ts');
const envProdPath = path.join(__dirname, '..', 'src', 'app', 'environments', 'environment.prod.ts');

fs.writeFileSync(envDevPath, environmentContent);
fs.writeFileSync(envProdPath, environmentProdContent);

console.log('Environment files generated from .env');
