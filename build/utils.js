#!/usr/bin/env node

const util = require('util');
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
            console.log('No files were found that match the given pattern. Files: \n', listOfFileNames);
        } else if (filesMatchingGivenPattern.length > 1) {
            const rl = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            await promptUserToSelectFile(filesMatchingGivenPattern, rl, workingDirectory, func);
            rl.close();
        } else {
            func(filesMatchingGivenPattern[0], workingDirectory);
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
        const stagedFileList = await executeCommandSynchronously('git diff --name-only', { cwd: process.cwd(), encoding: 'utf8' });
        const unStagedFileList = await executeCommandSynchronously('git ls-files -o --exclude-standard', { cwd: process.cwd(), encoding: 'utf8' });
        if (stagedFileList) {
            let formattedFileList = stagedFileList.stdout.split('\n').map((fileName) => fileName.trim()).filter((trimmedFileName) => trimmedFileName !== '');
            if (formattedFileList.length > 0) {
                if (unStagedFileList) {
                    formattedFileList.concat(unStagedFileList.stdout.split('\n').map((fileName) => fileName.trim()).filter((trimmedFileName) => trimmedFileName !== ''));
                }
                return formattedFileList;
            } else {
                return unStagedFileList.stdout.split('\n').map((fileName) => fileName.trim()).filter((trimmedFileName) => trimmedFileName !== '');
            }
        } else if (unStagedFileList) {
            return unStagedFileList.stdout.split('\n').map((fileName) => fileName.trim()).filter((trimmedFileName) => trimmedFileName !== '');
        }
        console.log('No modified files exist');
    },
    parseStagedFiles: async (listOfFileNames, fileName, workingDirectory, func) => {
        parseStagedFiles(listOfFileNames, fileName, workingDirectory, func);
    },
};
