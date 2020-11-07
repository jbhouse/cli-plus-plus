#!/usr/bin/env node

const util = require('util');
const childProcess = require('child_process');
const { exec } = require('child_process');

const execProm = util.promisify(exec);

async function executeCommandSynchronously(command, args) {
    let result;
    try {
        result = args ? await execProm(command, args) : await execProm(command);
    } catch (ex) {
        result = ex;
    }
    if (Error[Symbol.hasInstance](result)) {
        return;
    }
    return result;
}

const promptUserToSelectFile = (filesMatchingGivenPattern, readLine, workingDirectory, func) => {
    return new Promise((resolve, reject) => {
        var i = 0;
        var seperator = " - ";
        var displayableFiles = filesMatchingGivenPattern.map(str => i++ + seperator + str).join("\n") + "\n";
        readLine.question("\Multiple files match that pattern. Which file would you like to select? \n" + displayableFiles, (answer) => {
            func(filesMatchingGivenPattern[answer], workingDirectory);
            resolve();
        });
    });
}

async function parseStagedFiles(listOfFileNames, fileName, workingDirectory, func) {
    if (fileName[0] == '*') {
        const filesMatchingGivenPattern = listOfFileNames.filter((msg) => msg.toLowerCase().includes(fileName.slice(1, fileName.length).toLowerCase()));
        for await (file of filesMatchingGivenPattern) {
            await func(file, workingDirectory);
        };
    } else {
        const filesMatchingGivenPattern = listOfFileNames.filter((msg) => msg.toLowerCase().includes(fileName.toLowerCase()));
        if (filesMatchingGivenPattern.length === 0) {
            console.log('No files were found that match the given pattern. Files: \n', fileNames);
        } else if (filesMatchingGivenPattern.length > 1) {
            const rl = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            await promptUserToSelectFile(filesMatchingGivenPattern, rl, workingDirectory, func);
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

module.exports = {
    listBranches: async () => {
        const branchList = await executeCommandSynchronously('git branch -a', { cwd: process.cwd(), encoding: 'utf8' });
        if (branchList) {
            return branchList.stdout.split('\n').map((branchName) => branchName.trim()).filter((trimmedBranch) => trimmedBranch !== '');
        }
        console.log('Not currently in a git directory');
    },
    listStagedFiles: async () => {
        const stagedFileList = await executeCommandSynchronously('git diff --name-only --cached', { cwd: process.cwd(), encoding: 'utf8' });
        if (stagedFileList) {
            return stagedFileList.stdout.split('\n').map((fileName) => fileName.trim()).filter((trimmedFileName) => trimmedFileName !== '');
        }
        console.log('Not currently in a git directory');
    },
    listFileDiff: async () => {
        const stagedFileList = await executeCommandSynchronously('git diff --name-only --cached', { cwd: process.cwd(), encoding: 'utf8' });
        const unStagedFileList = await executeCommandSynchronously('git ls-files -o --exclude-standard', { cwd: process.cwd(), encoding: 'utf8' });
        if (stagedFileList) {
            const formattedFileList = stagedFileList.stdout.split('\n').map((fileName) => fileName.trim()).filter((trimmedFileName) => trimmedFileName !== '');
            if (unStagedFileList) {
                formattedFileList.concat(unStagedFileList.stdout.split('\n').map((fileName) => fileName.trim()).filter((trimmedFileName) => trimmedFileName !== ''));
            }
        } else if (unStagedFileList) {
            return unStagedFileList.stdout.split('\n').map((fileName) => fileName.trim()).filter((trimmedFileName) => trimmedFileName !== '');
        }
        console.log('Not currently in a git directory');
    },
    parseStagedFiles: async (listOfFileNames, fileName, workingDirectory, func) => {
        parseStagedFiles(listOfFileNames, fileName, workingDirectory, func);
    },
};
