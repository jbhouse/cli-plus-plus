#!/usr/bin/env node

(async () => {
  let pullRequestUrl = require('./gitUrl').gitUrl();
  pullRequestUrl += '\\pull\\new\\' + await require('./parseBranchNameFromList').getCurrentBranch();
  require('opn')(pullRequestUrl);
})();
