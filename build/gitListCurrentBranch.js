#!/usr/bin/env node

(async () => {
  console.log(await require('./parseBranchNameFromList').getCurrentBranch());
})();
