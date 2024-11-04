const jwt = require('jsonwebtoken');
const debug = require('debug')('formio:auth');
const error = require('debug')('formio:error');
class Auth {
  async token(payload, secret, expire = 240) {
    payload = Object.assign({}, payload);
    delete payload.iat;
    delete payload.exp;
    return new Promise((resolve, reject) => {
      if (!secret) {
        return reject('You cannot generate a token without a secret!');
      }
      debug('auth.token()', payload);
      jwt.sign(
        payload,
        secret,
        {
          expiresIn: expire * 60,
        },
        (err, signed) => {
          if (err) {
            error(err);
            return reject(err);
          }
          resolve(signed);
        },
      );
    });
  }

  async user(token, secret) {
    if (!token) {
      return Promise.resolve(null);
    }
    return new Promise((resolve, reject) => {
      if (!secret) {
        return reject('You cannot authenticate without a JWT Secret!');
      }
      debug('auth.verify()', token);
      jwt.verify(token, secret, (err, payload) => {
        if (err) {
          error(err);
          if (err.name === 'JsonWebTokenError') {
            return reject({ message: 'Bad Token' });
          }
          if (err.name === 'TokenExpiredError') {
            return reject({ message: 'Token Expired' });
          }
          return reject(err);
        }
        debug('auth.user()', payload);
        resolve(payload);
      });
    });
  }
}

module.exports = Auth;
