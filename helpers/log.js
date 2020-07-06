
let logEnabled = false
let _spinner = null

function formatDate (date) {
  var dateString =
  date.getUTCFullYear() +
    ('0' + (date.getUTCMonth() + 1)).slice(-2) +
    ('0' + date.getUTCDate()).slice(-2) + '-' +
    ('0' + date.getUTCHours()).slice(-2) +
    ('0' + date.getUTCMinutes()).slice(-2) +
    ('0' + date.getUTCSeconds()).slice(-2)
  return dateString
}

var debug = function (message) {
  if (logEnabled) {
    if (_spinner !== null) {
      _spinner.stop(true)
    }
    const now = new Date()
    console.log(formatDate(now) + ' ' + message)
    if (_spinner !== null) {
      _spinner.start()
    }
  }
}

var error = function (message, error) {
  if (logEnabled) {
    if (_spinner !== null) {
      _spinner.stop(true)
    }
    const now = new Date()
    console.error(formatDate(now) + ' ' + message, error)
    if (_spinner !== null) {
      _spinner.start()
    }
  }
}

var enableLog = function () {
  logEnabled = true
}

const setSpinner = function (spinner) {
  _spinner = spinner
}

module.exports = { debug, error, enableLog, setSpinner }
