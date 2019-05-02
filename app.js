const program = require('caporal');
const backend = require('./backend');

program
    .version('0.0.2')
    .description('CLI for FeatureNinjas projects');

program
    .command('valueOf <feature>')
    .alias('vo')
    .description('Returns the value of the given feature name')
    .action((feature) => {
        backend.getValueOf(feature, (result) => {
            console.log(result);
        });
    });

program
    .command('deploy')
    .action(() => {
        backend.deployFeatureSet();
    });

/* ********************************
 * 
 * Admin Commands
 * 
 * ********************************/

program
    .command('token list')
    .description('Lists all tokens')
    .action((args, options) => {
        backend.requestTokenList((result) => {
            console.log(result);
        });
    });

program
    .command('app list')
    .description('List all apps and app tokens')
    .option('--token <token>', 'The admin token given from the web account dashboard', undefined, undefined, true)
    .action((args, options) => {
        console.log(args);
        console.log(options);
    });

/* ********************************
 * 
 * Project/App Commands
 * 
 * ********************************/

program
    .command('push')
    .description('Pushes the given configuration file to the app with the given app-token')
    .argument('<file>', 'Path to configuration file')
    .option('--app-token <token>', 'The app token', undefined, undefined, true)
    .action((args, options) => {
        console.log(args);
        console.log(options);
    });

program
    .command('flags list')
    .description('List all current flags based on the given app token')
    .option('--token <token>', 'The app token', undefined, undefined, true)
    .action((args, options) => {
        console.log(args);
        console.log(options);
    });


program.parse(process.argv);