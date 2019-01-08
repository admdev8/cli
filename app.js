const program = require('commander');
const backend = require('./backend');

program
    .version('0.0.1')
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

program.parse(process.argv);