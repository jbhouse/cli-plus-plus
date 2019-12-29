#!/usr/bin/env node

(async () => {
  const branchName = process.argv[2];
  const workingDir = process.cwd();
  const branchList = await require('./gitListBranches').listBranches();
  const listOfBranches = branchList
    .filter((msg) => msg.includes('remotes/origin/'))
    .map((msg) => msg.replace('remotes/origin/', '').replace('*', '').trim())
    .filter((msg) => msg !== '');
  const branchNamesContainingInput = listOfBranches.filter((msg) => msg.includes(branchName));
  if (branchNamesContainingInput.length == 0) {
    console.log(`No branches were found with the branch name of: '${  branchName  }' branch messages: `, branchList);
  } else if (branchNamesContainingInput.length > 1) {
    console.log('More than one branch was found that contains the given input: ', branchNamesContainingInput);
  } else {
    require('child_process').exec(`git checkout ${  branchNamesContainingInput[0]}`, { cwd: workingDir }, (err, stdout, stderr) => {
      if (err) {
        console.log('error: ', err);
        return;
      } // node couldn't execute the command
      stdout ? console.log(stdout) : console.log(stderr);
    });
  }
})();
