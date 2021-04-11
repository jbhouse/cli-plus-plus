#!/usr/bin/env node

function applyStash(stashMessage) {
  require('child_process').exec('git stash list ', { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err) {
      console.log('Error: ', err);
      return;
    }
    stdout ? parseGitStashList(stdout, stashMessage, process.cwd()) : console.log(stderr);
  });
}

const promptUserToSelectStash = (stashMessagesContainingInput, rl, workingDirectory) => {
  return new Promise((resolve, reject) => {
    var i = 0;
    var seperator = " - ";
    var displayableStashMessages = stashMessagesContainingInput.map(str => str.split(": ")[2]).map(str => i++ + seperator + str).join("\n") + "\n";
    
    rl.question("\Multiple stashes match that pattern. Which stash would you like to apply? \n" + displayableStashMessages, (answer) => {
      require('child_process').exec(`git stash apply ${stashMessagesContainingInput[answer].split("stash@{")[1].split("}:")[0]}`, { cwd: workingDirectory }, (err, stdout, stderr) => {
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

async function parseGitStashList(stashList, stashMessage, workingDirectory) {
  const listOfStashMessages = stashList.split('\n');
  const stashMessagesContainingInput = listOfStashMessages.filter((msg) => msg.includes(stashMessage));
  if (stashMessagesContainingInput.length === 0) {
    console.log('No stashes were found with the given message. Stash messages: ', stashList);
  } else if (stashMessagesContainingInput.length > 1) {
    const rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    await promptUserToSelectStash(stashMessagesContainingInput, rl, workingDirectory);
    rl.close();
  } else {
    const stashToApply = `stash@{${listOfStashMessages.indexOf(stashMessagesContainingInput[0])}}`;
    require('child_process').exec(`git stash apply ${stashToApply}`, { cwd: workingDirectory }, (err, stdout, stderr) => {
      if (err) {
        console.log('Error: ', err);
        return;
      }
      stdout ? console.log(stdout) : console.log(stderr);
    });
  }
}

(() => {
  applyStash(process.argv.slice(2).join(' '));
})();
