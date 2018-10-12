'use strict';

const shell = require('shelljs');
const colors = require('colors/safe');
const wd = process.cwd();

function build() {

    // build docs
    shell.exec('npm run makedocs');
    console.log(colors.rainbow('\nDOCS BUILT!!\n\n'));    
};

build();