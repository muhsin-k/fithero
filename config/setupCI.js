/* @flow */

/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const rimraf = require('rimraf');

const filePath = path.join(__dirname, '..', 'secrets.js');

const argv = yargs.option('tearDown', {
  type: 'boolean',
}).argv;

if (argv.tearDown) {
  rimraf.sync(filePath);
} else {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      `/* @flow */

export const BUGSNAG_KEY = '';
`
    );
  }
}
