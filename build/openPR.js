#!/usr/bin/env node
"use strict";

(async () => {
    let pullRequestUrl = require('./gitUrl').gitUrl();
    pullRequestUrl += "\\pull\\new\\" + await require('./parseBranchNameFromList').getCurrentBranch();
    require('opn')(pullRequestUrl);
})();