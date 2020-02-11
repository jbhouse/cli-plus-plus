#!/usr/bin/env node

module.exports = {
  getCurrentBranch: async () => {
    const listOfBranches = await require('./gitListBranches').listBranches();
    return listOfBranches.filter((branchName) => branchName.includes('*'))[0].replace('* ', '');
  },
};
