"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require('jsonwebtoken');
const debug = require('debug')('formio:auth');
const error = require('debug')('formio:error');
class Auth {
    token(payload, secret, expire = 240) {
        return __awaiter(this, void 0, void 0, function* () {
            payload = Object.assign({}, payload);
            delete payload.iat;
            delete payload.exp;
            return new Promise((resolve, reject) => {
                if (!secret) {
                    return reject('You cannot generate a token without a secret!');
                }
                debug('auth.token()', payload);
                jwt.sign(payload, secret, {
                    expiresIn: expire * 60,
                }, (err, signed) => {
                    if (err) {
                        error(err);
                        return reject(err);
                    }
                    resolve(signed);
                });
            });
        });
    }
    user(token, secret) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
module.exports = Auth;
