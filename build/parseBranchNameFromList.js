"use strict";
module.exports = {
    getCurrentBranch: async () => {
        let listOfBranches = await require('./gitListBranches').listBranches();
        return listOfBranches.filter((branchName) => branchName.includes("*"))[0].replace("* ", "");
    }
}