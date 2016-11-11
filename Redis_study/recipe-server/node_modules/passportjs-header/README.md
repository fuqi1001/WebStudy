# passportjs-header

[![Build](https://travis-ci.org/chrisns/passportjs-header.png)](https://travis-ci.org/chrisns/passportjs-header)
[![Coverage](https://coveralls.io/repos/chrisns/passportjs-header/badge.png)](https://coveralls.io/r/chrisns/passportjs-header)
[![Quality](https://codeclimate.com/github/chrisns/passportjs-header.png)](https://codeclimate.com/github/chrisns/passportjs-header)
[![Dependencies](https://david-dm.org/chrisns/passportjs-header.png)](https://david-dm.org/chrisns/passportjs-header)

[Passport](http://passportjs.org/) strategy for authenticating within a header.

This is effectively a stripped down version of [passport-local](https://github.com/jaredhanson/passport-local).

This module lets you authenticate using a header username in your Node.js
applications.  By plugging into Passport, authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
$ npm install passportjs-header
```

## Usage

#### Configure Strategy

The header authentication strategy authenticates users based on the user id
sent in the HTTP headers by header worstations. The strategy requires a `verify`
callback, which accepts these credentials and calls `done` providing a user.

```js
passport.use(new HeaderStrategy(
  function(userid, done) {
    User.findOne({ userid: userid }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'header'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.post('/login', 
  passport.authenticate('Header', { failureRedirect: '/unauthenticated' }),
  function(req, res) {
    res.redirect('/');
  });
```

## Tests

```bash
$ npm install
$ npm test
```
