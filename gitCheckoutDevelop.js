#!/usr/bin/env node

(async () => {
    require('child_process').exec(`git checkout develop && git pull origin develop}`, { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (err) {
            console.log('error: ', err);
            return;
        } // node couldn't execute the command
        stdout ? console.log(stdout) : console.log(stderr);
    });
})();