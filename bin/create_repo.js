#!/usr/bin/env node

const cleanMockRepo = require('./../test/utils/cleanMockRepo');
const createMockRepo = require('./../test/utils/createMockRepo');
const growMockRepo = require('./../test/utils/growMockRepo');
const config = { ...require('./../config.json'), ...require('./../test/data/data.json') };

const { repoDir: cwd, commits } = config;

Promise.resolve()
  .then(() => cleanMockRepo(cwd))
  .then(() => createMockRepo(cwd, commits[0]))
  .then(() => growMockRepo(cwd, commits[1]))
  .then(() => growMockRepo(cwd, commits[2]));
