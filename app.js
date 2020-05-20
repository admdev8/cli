#!/usr/bin/env node

const program = require('caporal')
const env = require('./helpers/env')
const init = require('./commands/init')
const logger = require('./helpers/log')

program
  .version('0.0.2')
  .description('CLI for FeatureNinjas projects')

program
  .command('init')
  .option('--log-level <log-level>', 'Set log level', /^debug|info|warn|error$/)
  .option('--api-endpoint', 'Allows to override the default api endpoint https://api.featureninjas.com', /.*/g)
  .description('Initializes the curreng GitHub repository for feature flags')
  .action((args, options) => {
    logger.enableLog()
    if (options.logLevel !== undefined && options.logLevel !== false) {
      logger.setLogLevel(options.logLevel)
    }
    if (options.apiEndpoint !== false) {
      env.apiEndpoint = options.apiEndpoint
    }
    init.init()
  })

program
  .command('info')
  .action((args, options) => {
    console.log('FeatureNinjas CLI v0.0.9')
  })

program.parse(process.argv)
