#!/usr/bin/env node

const childProcess = require('child_process');

const resetFile = (fileName, workingDirectory) => {
    return new Promise(
        () => childProcess.exec(`git reset HEAD -- ${fileName}`, { cwd: workingDirectory }, (err, stdout, stderr) => {
            if (err) {
                console.log('Error: ', err);
                return;
            }
            stdout ? console.log(stdout) : console.log(stderr);
        })
    );
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

async function parseStagedFiles(listOfFileNames, fileName, workingDirectory) {
    if (fileName[0] == '*') {
        const filesMatchingGivenPattern = listOfFileNames.filter((msg) => msg.toLowerCase().includes(fileName.slice(1, fileName.length).toLowerCase()));
        for await (file of filesMatchingGivenPattern) {
            await resetFile(file, workingDirectory);
        };
    } else {
        const filesMatchingGivenPattern = listOfFileNames.filter((msg) => msg.toLowerCase().includes(fileName.toLowerCase()));
        if (filesMatchingGivenPattern.length === 0) {
            console.log('No staged files were found that match the given pattern. Staged files: \n', fileNames);
        } else if (filesMatchingGivenPattern.length > 1) {
            const rl = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            await promptUserToSelectFile(filesMatchingGivenPattern, rl, workingDirectory);
            rl.close();
        } else {
            childProcess.exec(`git reset HEAD -- ${filesMatchingGivenPattern[0]}`, { cwd: workingDirectory }, (err, stdout, stderr) => {
                if (err) {
                    console.log('Error: ', err);
                    return;
                }
                stdout ? console.log(stdout) : console.log(stderr);
            });
        }
    }
}

(async () => {
    const fileList = await require('./utils').listStagedFiles();
    if (null != fileList && undefined != fileList) {
        parseStagedFiles(fileList, process.argv.slice(2).join(' '), process.cwd())
    }
})();