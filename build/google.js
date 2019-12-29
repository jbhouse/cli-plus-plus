"use strict";
module.exports = {
    searchGoogle: (executablePath, url) => require('child_process').execFile(executablePath, [url], (err, data) => Boolean(err) ? console.error(err) : console.log(data))
};
