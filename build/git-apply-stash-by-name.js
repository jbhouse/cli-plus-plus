#!/usr/bin/env node
"use strict";

function applyStash(stashMessage) {
    require('child_process').exec('git stash list ', { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (Boolean(err)) {
            console.log("Error: ", err);
            return;
        }
        Boolean(stdout) ? this.parseGitStashList(stdout, stashMessage, process.cwd()) : console.log(stderr);
    });
}

function parseGitStashList(stashList, stashMessage, workingDirectory) {
    let listOfStashMessages = stashList.split("\n");
    let stashMessagesContainingInput = listOfStashMessages.filter(msg => msg.includes(stashMessage));
    if (stashMessagesContainingInput.length == 0) {
        console.log("No stashes were found with the given message. Stash messages: ", stashList);
    }
    else if (stashMessagesContainingInput.length > 1) {
        console.log("More than one stash was found that contains the given input: ", stashMessagesContainingInput);
    }
    else {
        let stashToApply = "stash@{" + listOfStashMessages.indexOf(stashMessagesContainingInput[0]) + "}";
        require('child_process').exec('git stash apply ' + stashToApply, { cwd: workingDirectory }, (err, stdout, stderr) => {
            if (Boolean(err)) {
                console.log("Error: ", err);
                return;
            }
            Boolean(stdout) ? console.log(stdout) : console.log(stderr);
        });
    }
}

(() => {
    applyStash(process.argv.slice(2).join(" "))
})();