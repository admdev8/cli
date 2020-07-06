const log = require('../helpers/log')
const auth = require('../auth/auth')
const Spinner = require('cli-spinner').Spinner
const fs = require('fs')
const fsp = require('fs').promises
const inquirer = require('inquirer')
const env = require('../helpers/env')
const axios = require('axios')
const out = require('../helpers/out')
const github = require('../helpers/github')
const path = require('path')

const run = async () => {
  const spinner = new Spinner()
  spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')

  try {
    // -----------------
    // get repository info
    // -----------------

    // second, get the repository of the current directory, check if this is a GitHub
    // repository, if not give a hint
    const repository = await github.getRepository()
    if (repository === null) {
      return
    }

    // -----------------
    // register user/account
    // -----------------

    // if this is a new user, register this user in the FN database
    const registerResult = await register(repository)
    if (registerResult === null) {
      return
    }

    // -----------------
    // register webhook
    // -----------------

    const webHookRegistered = await github.registerWebHook(repository)
    if (webHookRegistered === null) {
      return
    }

    // -----------------
    // Verify config file
    // -----------------

    if (!fs.existsSync('.featureninjas.yml')) {
      const resultCreateConfigFile = await inquirer.prompt([{
        type: 'confirm',
        name: 'createConfigFile',
        message: 'No config file found. Create default?'
      }, {
        type: 'confirm',
        name: 'createFlagsFile',
        message: 'Create sample flags file (flags.json5)?'
      }])
      if (resultCreateConfigFile.createConfigFile) {
        const configTemplate = await fsp.readFile(path.join(__dirname, '../templates/configFile.yml'))
        await fsp.writeFile('.featureninjas.yml', configTemplate)

        if (resultCreateConfigFile.createFlagsFile) {
          const flagsTemplate = await fsp.readFile(path.join(__dirname, '../templates/flags.json5'))
          await fsp.writeFile('flags.json5', flagsTemplate)
        }
      }
    }

    // ----------------
    // Print welcome info
    // ----------------

    out.showWelcomeMessage(registerResult.data, webHookRegistered)
  } catch (error) {
    console.error(error)

    log.error(error.message)
  }

  spinner.stop(true)
}

async function register (repository) {
  const spinner = new Spinner()
  spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
  spinner.setSpinnerTitle('%s checking user and account info')
  spinner.start()
  log.setSpinner(spinner)

  try {
    const octokitUser = await auth.getOctokitUserClient()

    const user = await octokitUser.users.getAuthenticated()
    const emails = await octokitUser.users.listEmails()

    // send user and repository to fn api to register this new user if the user doesn't exist yet (fn-api will handle this)
    const result = await axios.post(`${env.apiEndpoint}/repos`, {
      user: user.data,
      emails: emails.data,
      token: auth.getAccessToken(),
      repo: repository
    })
    log.debug(result)

    spinner.stop(true)
    out.successOneLiner('user and account created/updated')

    return result
  } catch (error) {
    spinner.stop(true)
    out.failOneLiner('could not get user info and register the repo at FN')

    log.debug(error)

    return null
  }
}

module.exports = {
  run
}
