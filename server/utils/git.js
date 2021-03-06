const { spawn } = require('child_process');

const git = (cmd = '', options = {}) =>
  new Promise((resolve, reject) => {
    let result = '';
    const args = cmd.split(/\s/);
    const proc = spawn('git', args, options);

    proc.stdout.on('data', data => {
      result = result.concat(data);
    });
    proc.stderr.on('data', data => {
      result = result.concat(data);
    });
    proc.on('close', () => resolve(result));
    proc.on('error', err => reject(err));
  });

module.exports = git;
