// Facebook Iframe Application example for Express on NodeJS
require.paths.unshift(__dirname + '/../../lib')

var kiwi = require('kiwi')

kiwi.require('express')
     require('express/plugins')
     require('facebook')

configure(function(){
  use(Static)
  use(Cookie)
  use(Logger)
  use(Session)
  use(ContentLength)
  use(MethodOverride)
  use(require('facebook').Facebook, {
    apiKey    : process.env['FB_API_KEY'],
    apiSecret : process.env['FB_SECRET_KEY']
  })
  set('root', __dirname)
})

// This is the canvas URL set in the Facebook Application settings
get('/iframe', function (){
  var fbSession = this.fbSession() // Will create a session based on verified data from the GET params

  this.sendfile(__dirname + '/public/iframe.html')
})

// Called to get information about the current authenticated user
get('/fbSession', function(){
  var fbSession = this.fbSession()

  if(fbSession) {
    // Here would be a nice place to lookup userId in the database
    // and supply some additional information for the client to use
  }

  // The client will only assume authentication was OK if userId exists
  this.contentType('json')
  this.halt(200, JSON.stringify(fbSession || {}))
})

run()
