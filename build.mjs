import { build } from 'vite';
import { readdir, copyFile } from 'node:fs/promises';
await build();
for (const file of await readdir('dist')) await copyFile('dist/' + file, file === 'dev.html' ? 'index.html' : file);
console.log('MerchantBoard production files are ready.');
