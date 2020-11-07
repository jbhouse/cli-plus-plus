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
};
