#!/usr/bin/env node

((command) => {
    require('child_process').exec(`${command} | clip`, { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err) {
      console.log('Error: ', err);
      return;
    }
  });
})(process.argv.slice(2).join(' '));
