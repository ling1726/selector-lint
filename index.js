import { lintFile } from './dist/index.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const res = lintFile(join(__dirname, 'fixtures', 'test.css'));
console.log(JSON.stringify(res, null, 2));