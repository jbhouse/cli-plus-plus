#!/usr/bin/env node

const resetFile = (fileName, workingDirectory) => {
    return new Promise(
        () => require('child_process').exec(`git checkout ${fileName}`, { cwd: workingDirectory }, (err, stdout, stderr) => {
            if (err) {
                console.log('Error: ', err);
                return;
            }
            stdout ? console.log(stdout) : console.log(stderr);
        })
    );
}

(async () => {
    const utils = require('./utils');
    const fileList = await utils.listFileDiff();
    if (null != fileList && undefined != fileList) {
        utils.parseStagedFiles(fileList, process.argv.slice(2).join(' '), process.cwd(), (fileName, workingDirectory) => resetFile(fileName, workingDirectory))
    }
})();