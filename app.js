#!/usr/bin/env node

const program = require('commander')
const env = require('./helpers/env')
const init = require('./commands/init')
const disconnect = require('./commands/disconnect')
const info = require('./commands/info')
const logger = require('./helpers/log')
const pjson = require('./package.json')

// /^debug|info|warn|error$/
program
  .option('-v, --verbose', 'Print verbose output')
  .option('--api-endpoint <api-endpoint>', 'Allows to override the default api endpoint https://api.featureninjas.com', /.*/g)
  .option('--web-endpoint <web-endpoint>', 'Allows to override the default web endpoint https://featureninjas.com', /.*/g)
  .option('--browser <browser>', 'The browser to use for authenticating with GitHub', /.*/g)
  .option('-l, --login <login>', 'Set the user to login with', /.*/g)

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
    initLogin()
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
    initLogin()
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
    initLogin()
    printEnv()
    info.run()
  })

program.parse(process.argv)

function initLog () {
  if (program.verbose !== undefined) {
    logger.enableLog()
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

function initLogin () {
  if (program.login !== undefined) {
    env.login = program.login
  }
}

function printEnv () {
  logger.debug('env:')
  logger.debug(`host:        ${env.host}`)
  logger.debug(`api:         ${env.api}`)
  logger.debug(`apiEndpoint: ${env.apiEndpoint}`)
  logger.debug(`webEndpoint: ${env.webEndpoint}`)
  logger.debug(`browser:     ${env.browser}`)
  logger.debug(`login:       ${env.login}`)
}
