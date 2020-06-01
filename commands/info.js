const log = require('../helpers/log')
const Spinner = require('cli-spinner').Spinner
const axios = require('axios')
const out = require('../helpers/out')
const github = require('../helpers/github')
const api = require('../external/api')

// make sure that 404 doesn't return an error in axios
axios.defaults.validateStatus = function () {
  return true
}

const run = async () => {
  const spinner = new Spinner()
  spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')

  try {
    // -----------------
    // get local repository info
    // -----------------
    const localRepository = await github.getRepository()
    if (localRepository === null) {
      return
    }
    out.printRepoInfo(localRepository)

    // -----------------
    // get repository info from FeatureNinjas
    // -----------------
    const remoteRepository = await api.reposGetRepoInfo(localRepository)
    if (remoteRepository === null) {
      return
    }
    if (remoteRepository.status === 404) {
      out.failOneLiner('repo not connected')
    } else {
      out.printRepoInfo(remoteRepository.data)
    }
  } catch (error) {
    console.error(error)

    log.error(error.message)
  }

  spinner.stop(true)
}

module.exports = {
  run
}
