
const logger = require('simple-node-logger').createSimpleLogger()

let logEnabled = false

var setLogLevel = function (logLevel) {
  logger.setLevel(logLevel)
}

var debug = function (message) {
  if (logEnabled) {
    logger.debug(message)
  }
}

var info = function (message) {
  logger.info(message)
}

var warn = function (message) {
  if (logEnabled) {
    logger.warn(message)
  }
}

var error = function (message, error) {
  if (logEnabled) {
    logger.error(message, error)
  }
}

var enableLog = function () {
  logEnabled = true
}

module.exports = { debug, info, warn, error, setLogLevel, enableLog }
