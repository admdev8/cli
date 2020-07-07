const log = require('../helpers/log')
const auth = require('../auth/auth')
const simpleGit = require('simple-git/promise')
const git = simpleGit()
const env = require('../helpers/env')
const Spinner = require('cli-spinner').Spinner
const out = require('../helpers/out')
const chalk = require('chalk')

const isGitDir = async function () {
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

const getRepository = async function () {
  const spinner = new Spinner()
  spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
  spinner.setSpinnerTitle('%s fetching info about your repository')
  spinner.start()
  log.setSpinner(spinner)

  try {
    const resultIsGitDir = await isGitDir()
    if (!resultIsGitDir) {
      spinner.stop(true)
      out.failOneLiner('current dir is no git dir. Do ' + chalk.yellow('git init') + ' and ' + chalk.yellow('git remote') + ' first')
      return null
    }

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
      ownerLogin: repository.data.owner.login,
      ownerId: repository.data.owner.id,
      ownerType: repository.data.owner.type,
      ownerAvatarUrl: repository.data.owner.avatar_url,
      repo: repository.data.name,
      repoFullName: repository.data.full_name
    }
    log.debug(JSON.stringify(result))

    spinner.stop(true)
    out.successOneLiner('repository info ok')
    return repository.data
  } catch (error) {
    spinner.stop(true)
    out.failOneLiner('this repo is no GitHub repository. FN currently only works with GitHub.')

    log.debug(error)
    return null
  }
}

const registerWebHook = async function (repository) {
  const spinner = new Spinner()
  spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
  spinner.setSpinnerTitle(`%s connecting ${repository.full_name} to FeatureNinjas`)
  spinner.start()
  log.setSpinner(spinner)

  try {
    const octokit = await auth.getOctokitUserClient()
    const hooks = await octokit.repos.listWebhooks({
      owner: repository.owner.login,
      repo: repository.name
    })
    log.debug('list hooks')
    log.debug(hooks)

    // check whether the hook already exists
    let createWebHook = true
    for (var i = 0; i < hooks.data.length; i++) {
      // this loop will only start when there is at least one webhook. if there is none,
      // then createWebHook will stay true and the webhook will be created below the loop
      var hook = hooks.data[i]
      log.debug(hook)
      log.debug(env.apiEndpoint)
      log.debug(hook.events.includes('push'))
      log.debug(hook !== null && hook.config.url === `${env.apiEndpoint}/github` && hook.events.includes('push'))
      if (hook !== null && hook.config.url === `${env.apiEndpoint}/github` && hook.events.includes('push')) {
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
      var response = await octokit.repos.createWebhook({
        owner: repository.owner.login,
        repo: repository.name,
        config: {
          url: `${env.apiEndpoint}/github`,
          content_type: 'json'
        }
      })
      log.debug(response)
    }

    spinner.stop(true)
    out.successOneLiner(`repository ${repository.full_name} connected`)

    return createWebHook
  } catch (error) {
    log.error(error)

    spinner.stop(true)
    out.failOneLiner(`repository ${repository.full_name} could not connected`)

    return null
  }
}

const removeWebHook = async function (repository) {
  const spinner = new Spinner()
  spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
  spinner.setSpinnerTitle('%s disconnecting')
  spinner.start()
  log.setSpinner(spinner)

  let success = false
  try {
    const octokit = await auth.getOctokitUserClient()
    const hooks = await octokit.repos.listWebhooks({
      owner: repository.owner.login,
      repo: repository.name
    })
    log.debug('list hooks')
    log.debug(hooks)

    let hookId = null
    log.debug(`${env.apiEndpoint}`)
    for (var i = 0; i < hooks.data.length; i++) {
      var hook = hooks.data[i]
      log.debug(hook.config.url)
      if (hook !== null && hook.config.url === `${env.apiEndpoint}/github`) {
        hookId = hook.id
      }
    }

    if (hookId === null) {
      spinner.stop(true)
      out.failOneLiner('repository not connected')
    } else {
      const response = await octokit.repos.deleteHook({
        owner: repository.owner.login,
        repo: repository.name,
        hook_id: hookId
      })
      log.debug(response)
      spinner.stop(true)
      out.successOneLiner('repository disconnected')
    }

    success = true
  } catch (error) {
    log.error(error)
    spinner.stop(true)
    out.failOneLiner('could not disconnect repository; please delete the webhook from within your repo settings at GitHub')
  }

  return success
}

module.exports = {
  isGitDir,
  getRepository,
  registerWebHook,
  removeWebHook
}
