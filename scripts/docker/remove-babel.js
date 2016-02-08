'use strict';

const fs = require('fs');
const path = require('path');
const R = require('ramda');

const pkg_path = path.join(__dirname, '../../package.json');
const pkg = require(pkg_path);

const remove_packages = ['babel-cli', 'babel-core', 'babel-preset-es2015-node4', 'babel-preset-stage-1'];

R.forEach(name => {
  delete pkg.dependencies[name];
}, remove_packages);

fs.writeFileSync(pkg_path, JSON.stringify(pkg, null, 2), 'utf8');
