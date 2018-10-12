'use strict';

const shell = require('shelljs');
const path  = require('path');
const colors = require('colors/safe');
const wd = process.cwd();

function build() {

    // build docs
    shell.exec('npm run makedocs');
    
    console.log(colors.rainbow('\n\nDOCS BUILT!!\n\n'));
    
    // build ui
    const uiSource = path.join(wd, 'node_modules/maprules-ui');
    shell.exec('npm install --prefix '  + uiSource);
    shell.exec('npm run build --prefix ' + uiSource);
    
    // make the maprule dir
    const uiDir = path.join(wd + '/maprule');

    if (shell.test('-d', uiDir)) shell.exec('rm -rf ' + uiDir);
    shell.mkdir(uiDir);
    const uiSourceDist = path.join(uiSource, 'dist/maprules-ui');

    shell.cp(uiSourceDist + '/*', uiDir);

    // take care of relative paths :(
    const index = path.join(uiDir, 'index.html');
    const styles = path.join(uiDir, 'styles.js');

    shell.sed('-i', /src=\"/g, 'src="maprule/', index);
    /* eslint-disable */
    shell.sed('-i', /fontawesome-webfont/g, 'maprule/fontawesome-webfont', styles);

    console.log(colors.rainbow('\n\nUI BUILT!!\n\n'))
    console.log(colors.rainbow('FINISHED!'))
};

build();