const log = require('../helpers/log')
const env = require('../helpers/env')
const { Octokit } = require('@octokit/rest')
const axios = require('axios')
const open = require('open')
const net = require('http')
const URL = require('url').URL
const httpTerminator = require('http-terminator')

var accessToken = ''
var octokitUser = null

var authenticateOctokitUser = async function () {
  log.debug('authenticating user')
  const rndstate = 'abcd'
  var code = ''

  // open local listener for the oauth callback
  var srv = net.createServer(async function (req, res) {
    var parsedUrl = new URL(env.api + req.url)
    if (parsedUrl.pathname !== '/signin-github') {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('failed')
      return
    }
    var queryData = parsedUrl.searchParams
    var state = queryData.get('state')
    if (state !== rndstate) {
      log.error('state does not match')
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('failed')
    }

    code = queryData.get('code')

    // res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.writeHead(301, { Location: env.webEndpoint + '/dashboard' })
    res.end()

    await ht.terminate()
  })
  var ht = httpTerminator.createHttpTerminator({
    server: srv
  })

  await srv.listen(0)

  const openOptions = {
    wait: false,
    url: true
  }
  if (env.browser !== null) {
    openOptions.app = env.browser
  }
  await open(`http://${env.apiEndpoint}/auth/oauth/authorize?port=${srv.address().port}&state=${rndstate}`, openOptions)

  await serverOn(srv, 'close')
  log.debug('server terminated')

  var response = await axios.post(`http://${env.apiEndpoint}/auth/oauth/access_token?code=${code}&state=${rndstate}`)
  accessToken = response.data.access_token

  octokitUser = new Octokit({
    auth: accessToken
  })
}

function serverOn (srv, event) {
  return new Promise(resolve => {
    srv.on(event, response => resolve(response))
  })
}

var getOctokitUserClient = async function () {
  if (octokitUser === null) {
    await authenticateOctokitUser()
  }
  return octokitUser
}

var getAccessToken = function () {
  return accessToken
}

module.exports = {
  getOctokitUserClient,
  getAccessToken
}
