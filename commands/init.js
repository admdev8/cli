
const log = require('simple-node-logger').createSimpleLogger()
const simpleGit = require('simple-git/promise')
const git = simpleGit()
const auth = require('../auth/auth')

const init = async () => {
  try {
    checkIfGitDir()

    // first, get the repository of the current directory
    const repository = await getRepository()

    // second, register a web hook
    await registerWebHook(repository)

    log.info('done')
  } catch (error) {
    log.error(error.message)
  }

  // b) config file
  // check for a valid .featureninjas.yml file
  // 1. Check that the current dir is the root dir of the repo
  // 2. Check that the current dir contains the .featureninjas.yml file
  //    -> yes: go to step c)
  //    -> no: ask for parameters to create one

  // c) check for a valid flags.json file

  /* octokit.apps.listInstallationsForAuthenticatedUser()
  .then(({ data }) => {
    console.log(data);
  }); */
}

async function registerWebHook (repository) {
  var octokit = await auth.getOctokitUserClient()
  var hooks = await octokit.repos.listHooks({
    owner: repository.owner,
    repo: repository.repo
  })
  console.log('list hooks')
  console.log(hooks)

  // check whether the hook already exists
  let createWebHook = true
  for (var i = 0; i < hooks.data.length; i++) {
    // this loop will only start when there is at least one webhook. if there is none,
    // then createWebHook will stay true and the webhook will be created below the loop
    var hook = hooks.data[i]
    if (hook !== null && hook.config.url === 'https://api.featureninjas.com/github' && hook.events.includes('push')) {
      // webhook set already, activate if not active
      createWebHook = false
      if (!hook.active) {
        // TODO activate the hook
      }
    } else {
      // hook does not exist yet, create
      console.log('hook does not exist, create')
      console.log(repository)
    }
  }

  // create the webhook if required
  if (createWebHook) {
    var response = await octokit.repos.createHook({
      owner: repository.owner,
      repo: repository.repo,
      config: {
        url: 'https://api.featureninjas.com/github',
        content_type: 'json'
      }
    })
    console.log(response)
  }
}

function checkIfGitDir () {
  try {
    git.checkIsRepo()
    log.info('a.1 current dir is under git')
  } catch (error) {
    throw new Error('a.1 current dir is not under git')
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
    log.info(JSON.stringify(result))
    return result
  } catch (error) {
    log.debug(error)
    throw new Error('Could not load repository because: ' + error.message + ' (reason: either no remote to GitHub added or another SCM instead of GitHub used)')
  }
}

const enableDebug = function () {
  log.setLevel('debug')
}

module.exports = { init, enableDebug }
