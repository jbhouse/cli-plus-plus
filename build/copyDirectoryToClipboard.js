#!/usr/bin/env node

(() => {
    require('child_process').exec('pwd', { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err) {
      console.log('Error: ', err);
      return;
    }
    stdout ? require('clipboardy').writeSync(stdout) : console.log(stderr);
  });
})();
