// Facebook Connect example for Express on NodeJS
require.paths.unshift(__dirname + '/../../lib')
require('hashlib')

var kiwi = require('kiwi')

kiwi.require('express')
     require('express/plugins')

configure(function(){
  use(Static)
  use(Cookie)
  use(Logger)
  use(Session, { lifetime: (15).minutes, reapInterval: (1).minute })
  use(ContentLength)
  use(MethodOverride)
  use(require('facebook').Facebook, {
    apiKey    : process.env['FB_API_KEY'],
    apiSecret : process.env['FB_SECRET_KEY']
  })
  set('root', __dirname)
})

// Static files in ./public
get('/', function(file){ this.sendfile(__dirname + '/public/index.html') })

run()
