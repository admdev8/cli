
const log = require('simple-node-logger').createSimpleLogger()
const simpleGit = require('simple-git/promise')
const git = simpleGit()
const auth = require('../auth/auth')
const Spinner = require('cli-spinner').Spinner
const chalk = require('chalk')
const fs = require('fs')
const fsp = require('fs').promises
const inquirer = require('inquirer')

// default endpoint
let apiEndpoint = 'https://api.featureninjas.com'

const init = async () => {
  const spinner = new Spinner()
  spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')

  try {
    spinner.setSpinnerTitle('%s fetching info about your repository')
    spinner.start()

    // -----------------
    // Check if current dir is git dir
    // -----------------

    // first, check if this is actually a git enabled directory, if not tell the user to do
    // git init and git remote first
    if (!isGitDir()) {
      console.log(chalk.red('✘') + ' current dir is no git dir. Do ' + chalk.yellow('git init') + ' and ' + chalk.yellow('git remote') + ' first')
      return
    }

    // -----------------
    // get repository info
    // -----------------

    // second, get the repository of the current directory, check if this is a GitHub
    // repository, if not give a hint
    const repository = await getRepository()

    spinner.stop(true)
    console.log(chalk.green('✔') + ' repository info ok')

    // -----------------
    // register webhook
    // -----------------

    spinner.setSpinnerTitle(`%s connecting ${repository.repoFullName} to FeatureNinjas`)
    spinner.start()
    await registerWebHook(repository)

    spinner.stop(true)
    console.log(chalk.green('✔') + ` repository ${repository.repoFullName} connected`)

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
        const configTemplate = await fsp.readFile('./templates/configFile.yml')
        await fsp.writeFile('.featureninjas.yml', configTemplate)

        if (resultCreateConfigFile.createFlagsFile) {
          const flagsTemplate = await fsp.readFile('./templates/flags.json5')
          await fsp.writeFile('flags.json5', flagsTemplate)
        }
      }
    }
  } catch (error) {
    log.error(error.message)
  }

  spinner.stop(true)
}

function isGitDir () {
  try {
    git.checkIsRepo()
    log.debug('current dir is under git')
    return true
  } catch (error) {
    log.debug('current dir is not under git')
    log.debug('error message thrown: ' + error.message)
    return false
  }
}

async function getRepository () {
  try {
    const octokitUser = await auth.getOctokitUserClient()

    const data = await git.listRemote(['--get-url'])
    log.debug(data)
    const regexp = /.*:\/\/.*@{0,1}.*\/(.*)\/(.*).git/g
    const regexpResult = regexp.exec(data)
    log.debug(regexpResult[0])
    const owner = regexpResult[1]
    const repo = regexpResult[2]
    log.debug(`Owner: ${owner}; Repo: ${repo}`)

    const repository = await octokitUser.repos.get({
      owner: owner,
      repo: repo
    })
    log.debug(repository)

    const result = {
      id: repository.data.id,
      owner: repository.data.owner.login,
      ownerId: repository.data.owner.id,
      ownerType: repository.data.owner.type,
      repo: repository.data.name,
      repoFullName: repository.data.full_name
    }
    log.debug(JSON.stringify(result))
    return result
  } catch (error) {
    log.debug(error)
    throw new Error('Could not load repository because: ' + error.message + ' (reason: either no remote to GitHub added or another SCM instead of GitHub used)')
  }
}

async function registerWebHook (repository) {
  var octokit = await auth.getOctokitUserClient()
  var hooks = await octokit.repos.listHooks({
    owner: repository.owner,
    repo: repository.repo
  })
  log.debug('list hooks')
  log.debug(hooks)

  // check whether the hook already exists
  let createWebHook = true
  for (var i = 0; i < hooks.data.length; i++) {
    // this loop will only start when there is at least one webhook. if there is none,
    // then createWebHook will stay true and the webhook will be created below the loop
    var hook = hooks.data[i]
    if (hook !== null && hook.config.url === `${apiEndpoint}/github` && hook.events.includes('push')) {
      // webhook set already, activate if not active
      createWebHook = false
      if (!hook.active) {
        // TODO activate the hook
      }
    } else {
      // hook does not exist yet, create
      log.debug('hook does not exist, create')
      log.debug(repository)
    }
  }

  // create the webhook if required
  if (createWebHook) {
    var response = await octokit.repos.createHook({
      owner: repository.owner,
      repo: repository.repo,
      config: {
        url: `${apiEndpoint}/github`,
        content_type: 'json'
      }
    })
    log.debug(response)
  }
}

const enableDebug = function () {
  log.setLevel('debug')
}

const setApiEndpoint = function (endpoint) {
  apiEndpoint = endpoint
}

module.exports = { init, enableDebug, setApiEndpoint }
