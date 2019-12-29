#!/usr/bin/env node
"use strict";

(() => {
    require('child_process').exec('git stash pop', { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (Boolean(err)) {
            console.log("Error: ", err);
            return;
        }
        Boolean(stdout) ? console.log(stdout) : console.log(stderr);
    });
})();