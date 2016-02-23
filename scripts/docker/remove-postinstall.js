'use strict';

const fs = require('fs');
const path = require('path');

const pkg_path = path.join(__dirname, '../../package.json');
const pkg = require(pkg_path);

delete pkg.scripts.postinstall;

fs.writeFileSync(pkg_path, JSON.stringify(pkg, null, 2), 'utf8');
