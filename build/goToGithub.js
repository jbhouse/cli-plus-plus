#!/usr/bin/env node
"use strict";

(async () => {
    require('opn')(require('./gitUrl').gitUrl());
})();