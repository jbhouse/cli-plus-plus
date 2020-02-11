#!/usr/bin/env node

(async () => {
  (() => {
    require('child_process').exec(`rundll32 url.dll, FileProtocolHandler ${require('./gitUrl').gitUrl()}`, (err, stdout, stderr) => {
      if (err) {
        console.log('Error: ', err);
        return;
      }
      stdout ? console.log(stdout) : console.log(stderr);
    });
  })();
})();
