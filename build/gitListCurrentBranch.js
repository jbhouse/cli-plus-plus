#!/usr/bin/env node
"use strict";
(async () => {
    console.log(await require('./parseBranchNameFromList').getCurrentBranch());
})();