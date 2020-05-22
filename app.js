#!/usr/bin/env node

const program = require('commander')
const env = require('./helpers/env')
const init = require('./commands/init')
const disconnect = require('./commands/disconnect')
const logger = require('./helpers/log')
const pjson = require('./package.json')

program
  .option('-ll, --log-level <log-level>', 'Set log level', /^debug|info|warn|error$/)
  .option('--api-endpoint <api-endpoint>', 'Allows to override the default api endpoint https://api.featureninjas.com', /.*/g)

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
    init.run()
  })

program
  .command('disconnect')
  .alias('dc')
  .action(() => {
    initLog()
    initApiEndpoint()
    disconnect.run()
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
