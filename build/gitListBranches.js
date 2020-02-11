const util = require('util');
const { exec } = require('child_process');

const execProm = util.promisify(exec);

async function getBranchListString(command, args) {
  let result;
  try {
    result = args ? await execProm(command, args) : await execProm(command);
  } catch (ex) {
    result = ex;
  }
  if (Error[Symbol.hasInstance](result)) {
    return;
  }
  return result;
}

module.exports = {
  listBranches: async () => {
    const branchList = await getBranchListString('git branch -a', { cwd: process.cwd(), encoding: 'utf8' });
    if (branchList) {
      return branchList.stdout.split('\n').map((branchName) => branchName.trim()).filter((trimmedBranch) => trimmedBranch !== '');
    }
    console.log('Not currently in a git directory');
  },
};
