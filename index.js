var xhr = require('xhr')
var qs = require('querystring')
var config = require('./config')

start()

function start () {
  var code = getCode()

  if (code) {
    getToken(code, function (err, token) {
      getProfile(token, function (err, profile) {
        renderProfile(profile)
      })
    })
  } else {
    renderLink()
  }
}

function renderProfile (profile) {
  var p = document.createElement('p')
  p.innerHTML = profile.name
  document.body.appendChild(p)
}

function getProfile (token, callback) {
  var options = {
    url: 'https://api.github.com/user',
    json: true,
    headers: {
      authorization: 'token ' + token
    }
  }

  xhr(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body)
  })
}

function getToken (code, callback) {
  var options = {
    url: config.gatekeeper + '/authenticate/' + code,
    json: true
  }

  xhr(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body.token)
  })
}

function getCode () {
  var query = window.location.href.split('?')[1]
  return qs.parse(query).code
}

function renderLink () {
  var ghURL = 'https://github.com/login/oauth/authorize?client_id=' + config.client_id + '&scope=user&redirect_uri=' + config.redirect_uri
  var link = document.createElement('a')
  link.href = ghURL
  link.innerHTML = 'Log in with GitHub'
  document.body.appendChild(link)
}
