const log = require('simple-node-logger').createSimpleLogger()
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

    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('yes!')

    await ht.terminate()
  })
  var ht = httpTerminator.createHttpTerminator({
    server: srv
  })

  await srv.listen(0)

  await open(`http://127.0.0.1:61877/cli/oauth/authorize?port=${srv.address().port}&state=${rndstate}`, { wait: false, url: true })

  await serverOn(srv, 'close')
  log.debug('server terminated')

  var response = await axios.post(`http://127.0.0.1:61877/cli/oauth/access_token?code=${code}&state=${rndstate}`)
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

module.exports = {
  getOctokitUserClient
}
