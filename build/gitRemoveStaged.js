#!/usr/bin/env node

function removeStaged(fileName) {
    require('child_process').exec('git diff --name-only --cached', { cwd: process.cwd() }, (err, stdout, stderr) => {
        if (err) {
            console.log('Error: ', err);
            return;
        }
        stdout ? parseStagedFiles(stdout, fileName, process.cwd()) : console.log(stderr);
    });
}

const resetFile = (fileName, workingDirectory) => {
    require('child_process').exec(`git reset HEAD -- ${fileName}`, { cwd: workingDirectory }, (err, stdout, stderr) => {
        if (err) {
            console.log('Error: ', err);
            return;
        }
        stdout ? console.log(stdout) : console.log(stderr);
    });
}

const promptUserToSelectFile = (filesMatchingGivenPattern, rl, workingDirectory) => {
    return new Promise((resolve, reject) => {
        var i = 0;
        var seperator = " - ";
        var displayableFiles = filesMatchingGivenPattern.map(str => i++ + seperator + str).join("\n") + "\n";
        rl.question("\Multiple files match that pattern. Which file would you like to unstage? \n" + displayableFiles, (answer) => {
            resetFile(filesMatchingGivenPattern[answer], workingDirectory);
            resolve();
        });
    });
}

async function parseStagedFiles(fileNames, fileName, workingDirectory) {
    const listOfFileNames = fileNames.split('\n');
    if (fileName[0] == '*') {
        const filesMatchingGivenPattern = listOfFileNames.filter((msg) => msg.includes(fileName.slice(1, fileName.length)));
        filesMatchingGivenPattern.forEach(file => {
            resetFile(file, workingDirectory);
        });
    } else {
        const filesMatchingGivenPattern = listOfFileNames.filter((msg) => msg.includes(fileName));
        if (filesMatchingGivenPattern.length === 0) {
            console.log('No staged files were found that match the given pattern. Staged files: ', fileNames);
        } else if (filesMatchingGivenPattern.length > 1) {
            const rl = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            await promptUserToSelectFile(filesMatchingGivenPattern, rl, workingDirectory);
            rl.close();
        } else {
            require('child_process').exec(`git reset HEAD -- ${filesMatchingGivenPattern[0]}`, { cwd: workingDirectory }, (err, stdout, stderr) => {
                if (err) {
                    console.log('Error: ', err);
                    return;
                }
                stdout ? console.log(stdout) : console.log(stderr);
            });
        }
    }
}

(() => {
    removeStaged(process.argv.slice(2).join(' '));
})();