#!/usr/bin/env node

(() => {
  const branchName = process.argv.slice(2).join(' ') ? process.argv.slice(2).join(' ') : 'origin develop';
  require('child_process').exec(`git fetch ${branchName}`, { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err) {
      console.log('Error: ', err);
      return;
    }
    stdout ? console.log(stdout) : console.log(stderr);
  });
})();
