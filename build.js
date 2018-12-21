'use strict';

const d3_json = require('d3-request').json;
const shell = require('shelljs');
const colors = require('colors/safe');
const writeFile = require('fs').writeFile;
const wd = process.cwd();

function getIDPresets(done) {
    d3_json('https://raw.githubusercontent.com/openstreetmap/iD/master/data/presets/presets.json', (err, res) => {
        if (err) {
            console.log(colors.bgRed('\nFAILED TO REQUEST ICONS!!!\n'));
            console.log(colors.bgRed('\nUSING EMPTY OBJECT INSTEAD!!!\n'));
            done({});
        } else {
            done(Object.values(res.presets).reduce((icons, preset) => {
                icons[Object.entries(preset.tags).sort().map(tag => tag.join('=')).join(':')] = preset.icon;
                return icons;
            }, {}));
        }
    });
}

function build() {
    // build docs
    shell.exec('npm run makedocs');
    console.log(colors.rainbow('\nDOCS BUILT!!\n\n'));

    getIDPresets((icons) => {
        const presetsLocation = wd + '/adapters/iDPresets/icons.json';
        writeFile(presetsLocation, JSON.stringify(icons), (err) => {
            if (err) {
                console.log(colors.bgRed('\nFAILED TO WRITE ICONS!!!\n'));
                console.log(err);
                process.exit(1);
            }
            console.log(colors.rainbow('\nICONS MAP BUILT!!\n\n'));
        });
    });
};

build();