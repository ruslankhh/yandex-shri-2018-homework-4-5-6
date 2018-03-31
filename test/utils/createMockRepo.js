const { mkdir, writeFile } = require('fs');
const path = require('path');
const { promisify } = require('util');

const git = require('./../../server/helpers/git');

const mkdirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);
const wait = delay => new Promise(resolve => setTimeout(resolve, delay));

/*
 * Создаёт git репозиторий на основании полученных данных.
 * Такая цепочка промисов необходима для последовательного:
 * - создания/переключения веток,
 * - cоздания папок,
 * - создания файлов внутри папок,
 * - создания коммитов.
 * Каждая новая ветка создаётся из первоначальной ветки.
 * Задержка нужна, чтобы git создавал коммиты в правильной последовательности.
 * В противном случае, мы бы получили непредсказуемый результат.
 */
const createMockRepo = (cwd, commits) => {
  let initBranch;
  let messageIndex = 0;

  return Promise.resolve()
    .then(() => mkdirAsync(cwd))
    .then(() => git('init', { cwd }))
    .then(() =>
      commits.reduce((promise, commit) => {
        const branch = Object.keys(commit)[0];

        if (!initBranch) {
          initBranch = branch;
        }

        return promise.then(() =>
          Promise.all([
            wait(1000),
            Promise.resolve()
              .then(() =>
                git('branch', { cwd }).then(data => {
                  if (data.includes(`${branch}\n`)) {
                    return git(`checkout ${branch}`, { cwd });
                  } else {
                    return git(`checkout -b ${branch}`, { cwd });
                  }
                })
              )
              .then(() =>
                commit[branch].reduce((promise, file) => {
                  return promise.then(() => {
                    if (file.isDirectory) {
                      return mkdirAsync(path.join(cwd, file.filepath));
                    } else {
                      return writeFileAsync(path.join(cwd, file.filepath), file.content);
                    }
                  });
                }, Promise.resolve())
              )
              .then(() => git(`add .`, { cwd }))
              .then(() => git(`commit -m Message#${messageIndex}`, { cwd }))
              .then(() => git(`checkout ${initBranch}`, { cwd }))
              .then(() => {
                messageIndex += 1;
              })
          ])
        );
      }, Promise.resolve())
    );
};

module.exports = createMockRepo;
