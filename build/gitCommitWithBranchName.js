#!/usr/bin/env node

(async function (commitMessage) {
  const parseBranchName = require('./parseBranchNameFromList.js');
  const modifiedCommitMessage = `${await parseBranchName.getCurrentBranch()}: ${commitMessage}`;
  require('child_process').exec(`git commit . -m "${modifiedCommitMessage}"`, { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err) {
      console.log('Error: ', err);
      return;
    }
    stdout ? console.log(stdout) : console.log(stderr);
  });
}(process.argv.slice(2).join(' ')));
