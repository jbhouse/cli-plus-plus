#!/usr/bin/env node

(async () => {
  let pullRequestUrl = require('./gitUrl').gitUrl();
  pullRequestUrl += '\\pull\\new\\' + await require('./parseBranchNameFromList').getCurrentBranch();
  (() => {
    require('child_process').exec(`rundll32 url.dll, FileProtocolHandler ${pullRequestUrl}`, (err, stdout, stderr) => {
      if (err) {
        console.log('Error: ', err);
        return;
      }
      stdout ? console.log(stdout) : console.log(stderr);
    });
  })(pullRequestUrl);
})();
