#!/usr/bin/env node

const promptUserToSelectBranch = (branchNamesContainingInput, rl, workingDirectory) => {
  return new Promise((resolve, reject) => {
    var i = 0;
    var seperator = " - ";
    var displayablebranchNames = branchNamesContainingInput.map(str => i++ + seperator + str).join("\n") + "\n";

    rl.question("\Multiple branches match that pattern. Which branch would you like to apply? \n" + displayablebranchNames, (answer) => {
      var branch = branchNamesContainingInput[answer];
      require('child_process').exec(`git checkout ${branch}`, { cwd: workingDirectory }, (err, stdout, stderr) => {
        if (err) {
          console.log('Error: ', err);
          return;
        }
        stdout ? console.log(stdout) : console.log(stderr);
      });
      resolve();
    });
  });
}

(async () => {
  const branchName = process.argv[2];
  const workingDir = process.cwd();
  const branchList = await require('./gitListBranches').listBranches();
  const listOfBranches = branchList
    .filter((msg) => msg.includes('remotes/origin/'))
    .map((msg) => msg.replace('remotes/origin/', '').replace('*', '').trim())
    .filter((msg) => msg !== '');
  const branchNamesContainingInput = listOfBranches.filter((msg) => msg.includes(branchName));
  if (branchNamesContainingInput.length === 0) {
    console.log(`No branches were found with the branch name of: '${branchName}' branch messages: `, listOfBranches);
  } else if (branchNamesContainingInput.length > 1) {

    const rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    await promptUserToSelectBranch(branchNamesContainingInput, rl, workingDir);
    rl.close();

  } else {
    require('child_process').exec(`git checkout ${branchNamesContainingInput[0]}`, { cwd: workingDir }, (err, stdout, stderr) => {
      if (err) {
        console.log('error: ', err);
        return;
      } // node couldn't execute the command
      stdout ? console.log(stdout) : console.log(stderr);
    });
  }
})();
