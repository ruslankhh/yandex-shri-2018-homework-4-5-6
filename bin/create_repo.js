#!/usr/bin/env node

const cleanMockRepo = require('./../test/utils/cleanMockRepo');
const createMockRepo = require('./../test/utils/createMockRepo');
const config = require('./../config.json');
const data = require('./../test/data/data.json');

const { repoDir: cwd } = config;
const { commits } = data;

Promise.resolve()
  .then(() => cleanMockRepo(cwd))
  .then(() => createMockRepo(cwd, commits));
