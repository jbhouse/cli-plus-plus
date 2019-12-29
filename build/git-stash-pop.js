#!/usr/bin/env node

(() => {
  require('child_process').exec('git stash pop', { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err) {
      console.log('Error: ', err);
      return;
    }
    stdout ? console.log(stdout) : console.log(stderr);
  });
})();
