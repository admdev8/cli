const log = require('../helpers/log')
const Spinner = require('cli-spinner').Spinner
const github = require('../helpers/github')
const env = require('../helpers/env')
const auth = require('../auth/auth')
const axios = require('axios')
const out = require('../helpers/out')

const run = async () => {
  const repository = await github.getRepository()
  const resultRemoveWebHook = await github.removeWebHook(repository)
  disconnect()
  log.debug(resultRemoveWebHook)
}

async function disconnect (repository) {
  const spinner = new Spinner()
  spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
  spinner.setSpinnerTitle('%s remove repo')
  spinner.start()

  try {
    // send user and repository to fn api to register this new user if the user doesn't exist yet (fn-api will handle this)
    const result = await axios.delete(`${env.apiEndpoint}/repos/${repository.repoFullName}`, {
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
