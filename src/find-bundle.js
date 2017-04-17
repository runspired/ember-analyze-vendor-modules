"use strict";
const fs = require('fs');
const path = require('path');

module.exports = function findBundle(args) {
  return function findBundleForArgs(project) {
    return new Promise((resolve, reject) => {
      let inputFilePath = args.bundlePath;

      if (!inputFilePath) {
        try {
          let dirPath = path.join(project.dir, './dist/assets');
          let dir = fs.readdirSync(dirPath, 'utf-8');

          for (let i = 0; i < dir.length; i++) {
            let name = dir[i];
            if (name.indexOf('vendor') !== -1 && name.indexOf('.js') !== -1) {
              inputFilePath = './dist/assets/' + name;
              break;
            }
          }

          if (!inputFilePath) {
            reject(new Error(`Bundle location resolved to <${dirPath}> but no bundle was present there.`));
            return;
          }
        } catch (e) {
          reject(e);
          return;
        }
      }

      try {
        project.bundlePath = inputFilePath;
        project.bundle = fs.readFileSync(inputFilePath, 'utf-8');
        resolve(project);
      } catch (e) {
        reject(e);
      }
    });
  };
};