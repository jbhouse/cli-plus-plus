#!/usr/bin/env node

(() => {
    const branchName = process.argv[2] ? process.argv[2] : 'develop';
    require('child_process').exec('git reset --soft HEAD~1', { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (err) {
            console.log('Error: ', err);
            return;
        }
        stdout ? console.log(stdout) : console.log(stderr);
    });
})();
