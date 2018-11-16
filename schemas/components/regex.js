'use strict';

const regex = {
    editor: /^idEditor$|^josmEditor$/i,
    maprulesGeometries: /^point$|^line$|^area$/i,
    josmGeometries: /([node|way|closedway],?)*/,
    iDGeometries: /^point$|^line$|^area$|^relation$|^vertex$/,
    iDCategories: /category-(point|area|line)/,
    field: /^[a-z]*$/i,
    osm: /^[a-z]*$/,
    primaryKey: /^[a-z]*$/i,
    primaryVal: /[a-z_]*/i,
    resource: /^config$|^presets$|^rules$/,
    wayType: /^closed$|^open$/
};

module.exports = regex;