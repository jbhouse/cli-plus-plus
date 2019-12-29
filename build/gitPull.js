#!/usr/bin/env node
"use strict";

(() => {
    let branchName = !!process.argv[2] ? process.argv[2] : "develop";
    require('child_process').exec('git pull origin ' + branchName, { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (Boolean(err)) {
            console.log("Error: ", err);
            return;
        }
        Boolean(stdout) ? console.log(stdout) : console.log(stderr);
    });
})();
