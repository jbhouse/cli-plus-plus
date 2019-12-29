#!/usr/bin/env node
"use strict";

(() => {
    require('child_process').exec('git commit . -m "' + process.argv.slice(2).join(" ") + '"', { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (Boolean(err)) {
            console.log("Error: ", err);
            return;
        }
        !!stdout ? console.log(stdout) : console.log(stderr);
    });
})();