#!/usr/bin/env node

(async () => {
    require('child_process').exec("pwd | clip", { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (err) {
            console.log('Error: ', err);
            return;
        }
        stdout ? console.log(stdout) : console.log(stderr);
    });
})();
