var passport = require('passport-strategy');
var util = require('util');

/**
 * `Strategy` constructor.
 *
 * The Header authentication strategy authenticates requests based on the
 * credentials submitted in the headers of a HTTP request.
 *
 * Applications must supply a `verify` callback which accepts `userid` and
 * credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 **
 * Examples:
 *
 *     passport.use(new HeaderStrategy(
 *       function(userid, done) {
 *         User.findOne({ userid: userid}, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Function} verify
 * @api public
 */
function Strategy(verify) {
  if (!verify) {
    throw new TypeError('HeaderStrategy requires a verify callback');
  }

  passport.Strategy.call(this);
  this.name = 'Header';
  this._verify = verify;
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
Strategy.prototype.authenticate = function (req) {
  var userid;
  try {
    userid = req.headers.http_email || req.socket.handshake.headers.http_email;
  }
  catch (e) {
    return this.fail({message: 'Missing credentials'}, 400);
  }

  var self = this;

  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    self.success(user, info);
  }

  try {
    this._verify(userid, verified);
  } catch (ex) {
    return self.error(ex);
  }

};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
