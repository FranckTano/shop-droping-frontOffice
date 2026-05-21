// Minimal version script required by prebuild step.
const fs = require('fs');
const pkg = require('./package.json');
const v = pkg.version || '0.0.0';
fs.writeFileSync('build-version.txt', v);
console.log('version:', v);
