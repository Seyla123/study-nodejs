const fs = require('fs');

const textIn = fs.readFileSync('./text.txt', 'utf8');
console.log(textIn);

const textOut = `Hello is text in text.tx ${textIn}!.\n Created on ${Date.now()}`;
fs.writeFileSync('./output.txt', textOut);

console.log('writted !');
