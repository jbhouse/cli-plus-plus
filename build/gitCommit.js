"use strict";
module.exports = {
    gitCommit: (workingDirectory, commitMessage) => {
        /*
        * The commit message is based on terminal input of indeterminate length collected into a string array
        * We need to create one coherent message by prepending each word with a space and adding it to the message itself
        */
        let workingDir = Boolean(workingDirectory) ? workingDirectory : process.cwd();
        require('child_process').exec('git commit . -m "' + commitMessage + '"', { cwd: workingDir }, (err, stdout, stderr) => {
            if (Boolean(err)) {
                console.log("Error: ", err);
                return;
            } // node couldn't execute the command
            Boolean(stdout) ? console.log(stdout) : console.log(stderr);
        });
    }
};
