
const logger = require('simple-node-logger').createSimpleLogger()

var setLogLevel = function (logLevel) {
  logger.setLevel(logLevel)
}

var debug = function (message) {
  logger.debug(message)
}

var info = function (message) {
  logger.info(message)
}

var warn = function (message) {
  logger.warn(message)
}

var error = function (message, error) {
  logger.error(message, error)
}

module.exports = { debug, info, warn, error, setLogLevel }
