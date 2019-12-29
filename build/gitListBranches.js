"use strict";
const util = require("util");
const { exec } = require("child_process");
const execProm = util.promisify(exec);
module.exports = {
    listBranches: async () => {
        let branchList = await getBranchListString("git branch -a", { cwd: process.cwd(), encoding: "utf8" });
        if (!!branchList) {
            return branchList['stdout'].split('\n').map((branchName) => branchName.trim()).filter((trimmedBranch) => trimmedBranch !== '');
        } else {
            console.log("Not currently in a git directory");
        }
    }
};
async function getBranchListString(command, args) {
    let result;
    try {
        result = Boolean(args) ? await execProm(command, args) : await execProm(command);
    }
    catch (ex) {
        result = ex;
    }
    if (Error[Symbol.hasInstance](result)) {
        return;
    }
    return result;
}