"use strict";
const fs = require('fs');
const path = require('path');

module.exports = function findProject(args) {
  return function findProjectForArgs() {
    return new Promise((resolve, reject) => {
      let project = {
        name: '',
        dir: args.projectPath || process.cwd(),
        path: '',
        bundle: ''
      };

      try {
        let pathToProject = path.join(project.dir, './index');
        let emberProject = require(pathToProject);
        project.name = emberProject.name;
        project.path = pathToProject;

        if (!project.name) {
          throw new Error(`Resolved Project at location <${pathToProject}>, but it has no name.`);
        }

      } catch (e) {
        reject(e);
      }

      resolve(project)
    });
  }
};