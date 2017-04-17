"use strict";
const gzipSize = require('gzip-size').sync;

module.exports = function analyzeBundle(args) {
  return function analyzeBundleForArgs(project) {
    const SHOW_MODULES = args.showBundle;
    const INPUT_FILE = project.bundlePath;
    const projectName = project.name;
    const builtAsset = project.bundle;

    console.log('Processing ' + projectName + ' modules from: ' + INPUT_FILE);


    let modules = builtAsset.split('define(').join('MODULE_SPLIT_POINTdefine(').split('MODULE_SPLIT_POINT');

    modules = modules.filter((module) => {
      return module.indexOf(projectName + '/') === 8;
    });

    let moduleSizes = [];
    let concatModule = '';

    modules.forEach((m) => {
      let end = m.indexOf(',', 8) - 1;
      let name = m.substring(8, end);
      let bytes = byteCount(m);
      let gzipBytes = gzipSize(m);
      concatModule += m;

      moduleSizes.push({
        size: m.length,
        trueSize: bytes,
        gzipSize: gzipBytes,
        per: 0,
        perZip: 0,
        bytes: formatBytes(bytes),
        gzipBytes: formatBytes(gzipBytes),
        name,
        module: m
      });
    });

    let totalSize = byteCount(concatModule);
    let totalGzipSize = gzipSize(concatModule);

    moduleSizes.forEach((s) => {
      s.per = (s.trueSize / totalSize * 100).toFixed(1) + ' %';
      s.perZip = (s.gzipSize / totalGzipSize * 100).toFixed(1) +  ' %';
    });

    moduleSizes = moduleSizes.sort((a, b) => {
      return a.gzipSize > b.gzipSize ? -1 : 1;
    });

    function formatBytes(b) {
      let str;
      if (b > 1024) {
        str = (b / 1024).toFixed(2) + ' KB';
      } else {
        str = b + ' B';
      }

      while (str.length < 8) {
        str = ' ' + str;
      }

      return str;
    }

    function byteCount(s) {
      return encodeURI(s).split(/%..|./).length - 1;
    }

    console.log('\n\n' + projectName + ' Asset Size Report');
    console.log('================================================================================================');
    console.log('\tTotal: ' + formatBytes(totalSize));
    console.log('\tgZip: ' + formatBytes(totalGzipSize));
    console.log('\tModules: ' + moduleSizes.length);
    console.log('================================================================================================');
    console.log('  Bytes\t\tPercent\t  Gzip Bytes\tPercent\tModule Name');
    console.log('------------------------------------------------------------------------------------------------');

    moduleSizes.forEach((s) => {
      console.log(s.bytes + '\t' + s.per + '\t' + s.gzipBytes + '\t' + s.perZip + '\t' + s.name);
    });

    if (SHOW_MODULES) {
      console.log('\n\n================================================================================================');
      console.log('\t\tModules By Size');
      console.log('================================================================================================', '\n\n\n');

      moduleSizes.forEach((s) => {
        console.log('\n\n\n', s.module);
      });
    }
  };
};