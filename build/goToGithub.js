#!/usr/bin/env node

(async () => {
  require('opn')(require('./gitUrl').gitUrl());
})();
