#!/usr/bin/env node

(() => {
  require('child_process').exec(`rundll32 url.dll, FileProtocolHandler https://www.google.com/search?q=${process.argv.slice(2).join('+')}`, (err, stdout, stderr) => {
    if (err) {
      console.log('Error: ', err);
      return;
    }
    stdout ? console.log(stdout) : console.log(stderr);
  });
})();
