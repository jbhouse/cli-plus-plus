#!/usr/bin/env node

module.exports = {
  gitUrl: function gitUrl() {
    const gitConfigContents = require('fs').readFileSync(`${process.cwd()}\\.git\\config`).toString().split('\n');
    const githubUrl = gitConfigContents[(gitConfigContents.indexOf('[remote "origin"]') + 1)].trim().split('= ')[1];
    return githubUrl.substring(0, githubUrl.length - 4);
  },
};
