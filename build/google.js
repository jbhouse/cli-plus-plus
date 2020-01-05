#!/usr/bin/env node

(() => {
  require('opn')(`https://www.google.com/search?q=${process.argv.slice(2).join('+')}`);
})();
