'use strict';

const shell = require('shelljs');
const path  = require('path');
const colors = require('colors/safe');
const wd = process.cwd();

function build() {

    // build docs
    shell.exec('npm run makedocs');
    
    console.log(colors.rainbow('\n\nDOCS BUILT!!\n\n'));
    
};

build();