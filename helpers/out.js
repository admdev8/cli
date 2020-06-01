const chalk = require('chalk')

var successOneLiner = function (message) {
  console.log(chalk.green('✔') + ' ' + message)
}

var failOneLiner = function (message) {
  console.log(chalk.red('✘') + ' ' + message)
}

function printTitle (printWelcomeTo) {
  console.log()
  if (printWelcomeTo) { console.log('Welcome to') }
  console.log(' ______         _                  _   _ _       _')
  console.log('|  ____|       | |                | \\ | (_)     (_)')
  console.log('| |__ ___  __ _| |_ _   _ _ __ ___|  \\| |_ _ __  _  __ _ ___')
  console.log('|  __/ _ \\/ _` | __| | | | \'__/ _ \\ . ` | | \'_ \\| |/ _` / __|')
  console.log('| | |  __/ (_| | |_| |_| | | |  __/ |\\  | | | | | | (_| \\__ \\')
  console.log('|_|  \\___|\\__,_|\\__|\\__,_|_|  \\___|_| \\_|_|_| |_| |\\__,_|___/')
  console.log('                                               _/ |')
  console.log('                                              |__/           ')
  console.log('')
}

function printNextSteps () {
  console.log('')
  console.log(chalk.blue('Next Steps:'))
  console.log(' 1) Add or update flags in flags.json5')
  console.log(' 2) Push changes to your repository using git add/commit/push')
  console.log(' 3) Use our API to retrieve your flags')
  console.log('    Example: curl -X GET \\')
  console.log('               https://api.featureninjas.com/flags/<account-name>/<repo-name>/<branch_ref_name> \\')
  console.log('               -H \'X-FeatureNinjas-Secret: <secret>\'')
  console.log('')
}

var showWelcomeMessage = function (registerResult, webHookRegistered) {
  if (registerResult.userExists === true && registerResult.accountExists === true) {
    printTitle()
    if (webHookRegistered) {
      console.log('The repository was ' + chalk.black.bgGreen('successfully') + ' registered')
    } else {
      console.log('The repository is registered on our side already')
    }
  } else if (registerResult.userExists === false && registerResult.accountExists === false) {
    printTitle()
    console.log('You are now on the ' + chalk.black.bgGreen('STARTER PLAN'))
    console.log('Check out ' + chalk.blue.underline('https://featureninjas.com') + ' for more info on the PRO plan which includes rollout strategies and extended logic')
    printNextSteps()
  }
  console.log('')
}

var printRepoInfo = function (repository) {
  console.log(repository)
}

module.exports = {
  successOneLiner,
  failOneLiner,
  showWelcomeMessage,
  printRepoInfo
}
