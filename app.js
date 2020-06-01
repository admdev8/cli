#!/usr/bin/env node

const program = require('commander')
const env = require('./helpers/env')
const init = require('./commands/init')
const disconnect = require('./commands/disconnect')
const info = require('./commands/info')
const logger = require('./helpers/log')
const pjson = require('./package.json')

program
  .option('-ll, --log-level <log-level>', 'Set log level', /^debug|info|warn|error$/)
  .option('--api-endpoint <api-endpoint>', 'Allows to override the default api endpoint https://api.featureninjas.com', /.*/g)
  .option('--web-endpoint <web-endpoint>', 'Allows to override the default web endpoint https://featureninjas.com', /.*/g)
  .option('--browser <browser>', 'The browser to use for authenticating with GitHub', /.*/g)

program
  .version(pjson.version)
  .description('CLI for FeatureNinjas projects')

program
  .command('init')
  .alias('i')
  .description('Initializes the current GitHub repository for feature flags')
  .action(() => {
    initLog()
    initApiEndpoint()
    initWebEndpoint()
    initBrowser()
    init.run()
  })

program
  .command('disconnect')
  .alias('d')
  .description('Disconnects the current git repository from FeatureNinjas')
  .action(() => {
    initLog()
    initApiEndpoint()
    initWebEndpoint()
    initBrowser()
    disconnect.run()
  })

program
  .command('info')
  .description('Shows info about the current git repository and its connection to FeatureNinjas')
  .action(() => {
    initLog()
    initApiEndpoint()
    initWebEndpoint()
    initBrowser()
    info.run()
  })

program.parse(process.argv)

function initLog () {
  logger.enableLog()
  if (program.logLevel !== undefined) {
    logger.setLogLevel(program.logLevel)
  }
}

function initApiEndpoint () {
  if (program.apiEndpoint !== undefined) {
    env.apiEndpoint = program.apiEndpoint
  }
}

function initWebEndpoint () {
  if (program.webEndpoint !== undefined) {
    env.webEndpoint = program.webEndpoint
  }
}

function initBrowser () {
  if (program.browser !== undefined) {
    env.browser = program.browser
  }
}