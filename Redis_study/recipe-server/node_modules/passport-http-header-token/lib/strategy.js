/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util')
  , lookup = require('./utils').lookup;


/**
 * `Strategy` constructor.
 *
 * The token authentication strategy authenticates requests based on the
 * credentials submitted through request headers.
 *
 * Applications must supply a `verify` callback which accepts `username` and
 * `password` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `tokenHeader`  header name where the token is found, defaults to _authorization_
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new HTTPHeaderTokenStrategy(
 *       function(token, done) {
 *         User.findOne({ token: token }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('HTTPHeaderTokenStrategy requires a verify callback'); }

  this._tokenHeader = options.tokenHeader || 'authorization';
  this._tokenTitle = options.tokenTitle || 'Token';
  this._errorChallenge = options.errorChallenge;
  this._errorStatus = options.errorStatus || 401;

  passport.Strategy.call(this);
  this.name = 'http-header-token';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var fullToken = req.headers[this._tokenHeader];
  var self = this;

  if (!fullToken) {
    return fail();
  }

  var token;
  var parts = fullToken.split(' ');
  if (parts.length == 2) {
    var scheme = parts[0]
      , credentials = parts[1];

    var tokenRe = new RegExp('^'+this._tokenTitle, 'i');
    if (tokenRe.test(scheme)) {
      token = credentials;
    }
  }

  if (!token) {
    return fail();
  }

  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }

  function fail() {
    if (self._errorChallenge) {
      self.fail(self._errorChallenge, self._errorStatus);
    } else {
      self.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
    }
  }

  try {
    if (self._passReqToCallback) {
      this._verify(req, token, verified);
    } else {
      this._verify(token, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
