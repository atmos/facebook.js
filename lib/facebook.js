// Facebook for Express
// Pluginized by atmos - Originally by Dominiek ter Heide

var sys     = require('sys'),
    hashlib = require('hashlib')

exports.FBSession = new Class({
  /**
   * Initialize session with userId.
   *
   * @param  {string} userId
   * @param  {string} metaInfo
   * @api public
   */
  constructor: function (userId, metaInfo) {
    this.userId     = userId

    this.pic        = metaInfo['pic']
    this.name       = metaInfo['name']
    this.last_name  = metaInfo['last_name']
    this.first_name = metaInfo['first_name']
  }
});

exports.getFingerprintForCookie = function (apiKey, cookies) {
  var fields = ['expires', 'session_key', 'ss', 'user'];
  var fingerprint = '';
  fields.sort();
  for(var i in fields) {
    fingerprint += fields[i]+'='+cookies[apiKey + '_' + fields[i]];
  }
  return fingerprint;
}

exports.getFingerprintForParams = function (params) {
  var fields = [];
  for(var i in params) {
    if(i.match(/^fb_sig_/)) {
      fields.push(i);
    }
  }
  fields.sort();
  var fingerprint = '';
  fields.sort();
  for(var i in fields) {
    fingerprint += fields[i].replace(/^fb_sig_/, '')+'='+params[fields[i]];
  }
  return fingerprint;
}

// --- Facebook
exports.Facebook = Plugin.extend({
  extend: {

    /**
     * Initialize extensions.
     */

    init: function(options) {
      var apiKey    = options['apiKey']
      var apiSecret = options['apiSecret']

      // Routes
      get('/xd_receiver.htm', function(file) {
        this.sendfile(__dirname + '/facebook/static/xd_receiver.htm')
      })

      get('/javascripts/jquery.facebook.js', function(file) {
        this.sendfile(__dirname + '/facebook/static/jquery.facebook.js')
      })

      // Called on Facebook logout
      get('/facebook/logout', function() {
        this.fbLogout()
        this.halt(200, JSON.stringify({}))
      })

      // Called to get information about the current authenticated user
      get('/facebook/session', function(){
        var fbSession = this.fbSession()

        if(fbSession) {
          // Here would be a nice place to lookup userId in the database
          // and supply some additional information for the client to use
        }

        // The client will only assume authentication was OK if userId exists
        this.contentType('json')
        this.halt(200, JSON.stringify(fbSession || {}))
      })

      // Called after a successful FB Connect
      post('/facebook/session', function() {
        var fbSession = this.fbSession() // Will return null if verification was unsuccesful

        if(fbSession) {
          // Here would be a nice place to lookup userId in the database
          // and supply some additional information for the client to use
        }

        this.contentType('json')
        this.halt(200, JSON.stringify(fbSession || {}))
      })

      // --- Internal methods
      Request.include({
        /**
         * Find or create Facebook session based on stored session, GET params or cookie
         *
         * @param  {hash} options
         * @return {FBSession}
         * @api public
         */

        fbSession: function(options) {
          var session = this.session.fbSession

          if(session && session.userId)
            return session

          if(this.fbAuthenticate()) {
            var userId   = this.cookie(apiKey + '_user'),
                metaInfo = this.params.post;

            this.session.fbSession = new exports.FBSession(userId, metaInfo)
            return this.session.fbSession
          }
          return null
        },

        /**
         * Try authenticating by verifying Facebook data in GET params and cookie
         *
         * @param  {hash} options
         * @return {FBSession}
         * @api public
         */

        fbAuthenticate: function(options) {
          var params      = this.params.post,
              cookies     = this.cookies,
              signature   = null,
              fingerprint = null;

          if(cookies && cookies[apiKey]) {
            fingerprint = exports.getFingerprintForCookie(apiKey, cookies)
            signature = cookies[apiKey]
          }
          if(params && params['fb_sig']) {
            fingerprint = exports.getFingerprintForParams(params)
            signature = params['fb_sig']
          }
          if(!fingerprint)
            return null

          // Verify signature using apiSecret
          var expected_signature = hashlib.md5(fingerprint+apiSecret)
          var valid = (expected_signature === signature)
          if(!valid)
            sys.puts("Warning, invalid signature: " + fingerprint)
          return valid
        },

        /**
         * Logout
         * @return null
         * @api public
         */
        fbLogout: function() {
          this.session.fbSession = null
          return null
        },
      })
    }
  }
})
