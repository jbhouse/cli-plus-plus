#!/usr/bin/env node

(() => {
    require('child_process').exec(`npm i -g ${process.argv.slice(2).join(' ')}`, { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (err) {
            console.log('Error: ', err);
            return;
        }
        stdout ? console.log(stdout) : console.log(stderr);
    });
})();
