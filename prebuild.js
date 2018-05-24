const { echo, exec } = require('shelljs');

const packages = [
    './node_modules/nebpay.js', 
    // ... other dependencies
];

echo('\nPre build starts.\n');
packages.forEach(pack => exec(`babel --presets=es2015 ${pack} --out-dir ${pack}`));
echo('\nPre build finished.\n');