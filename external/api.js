const Spinner = require('cli-spinner').Spinner
const axios = require('axios')
const env = require('../helpers/env')

const reposGetRepoInfo = async function (repository) {
  const spinner = new Spinner()
  spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
  spinner.setSpinnerTitle('%s get connected repo info')
  spinner.start()

  const remoteRepository = await axios.get(`${env.apiEndpoint}/repos/${repository.full_name}`)
  if (remoteRepository === null || remoteRepository === undefined) {
    spinner.stop(true)
    return null
  }
  spinner.stop(true)
  return remoteRepository
}

module.exports = {
  reposGetRepoInfo
}
