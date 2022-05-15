const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'text.txt');
const readableFile = fs.createReadStream(`${pathToFile}`, 'utf-8');
let data = '';
readableFile.on('data', (chunk) => (data += chunk));
readableFile.on('end', () => console.log('', data));
