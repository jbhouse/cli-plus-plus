#!/usr/bin/env node

(() => {
  require('child_process').exec('pwd', { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err) {
      console.log('Error: ', err);
      return;
    }
    if (stderr) {
      console.log(stderr);
      return;
    }
    (() => {
      require('child_process').exec(`${stdout} | clip`, { cwd: process.cwd() }, (error, standardOut, standardError) => {
        if (error) {
          console.log('Error: ', err);
          return;
        }
        standardOut ? console.log(standardOut) : console.log(standardError);
      });
    })(stdout);
  });
})();
