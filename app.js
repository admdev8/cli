#!/usr/bin/env node

const program = require('caporal')
const init = require('./commands/init')

program
  .version('0.0.2')
  .description('CLI for FeatureNinjas projects')

program
  .command('init')
  .option('-d', 'Enables debug mode', program.BOOL)
  .option('--api-endpoint', 'Allows to override the default api endpoint https://api.featureninjas.com', /.*/g)
  .description('Initializes the curreng GitHub repository for feature flags')
  .action((args, options) => {
    if (options.d === true) {
      init.enableDebug()
    }
    if (options.apiEndpoint !== false) {
      init.setApiEndpoint(options.apiEndpoint)
    }
    init.init()
  })

program
  .command('info')
  .action((args, options) => {
    console.log('FeatureNinjas CLI v0.0.9')
  })

program.parse(process.argv)
