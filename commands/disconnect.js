const log = require('../helpers/log')
const github = require('../helpers/github')

const run = async () => {
  const repository = await github.getRepository()
  const resultRemoveWebHook = await github.removeWebHook(repository)
  log.debug(resultRemoveWebHook)
}

module.exports = {
  run
}
