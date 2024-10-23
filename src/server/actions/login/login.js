const bcrypt = require('bcryptjs');
import { has, set, get, unset } from 'lodash';
const debug = require('debug')('formio:action:login');
const error = require('debug')('formio:error');
const LoginAction = {
  // The action information.
  get info() {
    return {
      name: 'login',
      title: 'Login',
      description: 'Provides a way to login to the application.',
      priority: 2,
      defaults: {
        handler: ['before'],
        method: ['create'],
      },
      access: {
        handler: false,
        method: false,
      },
    };
  },

  /**
   * The settings form for this action.
   * @param {*} scope
   */
  async settingsForm(scope) {
    const fields = [];
    const resources = [];
    for (let name in scope.template.resources) {
      const resource = scope.template.resources[name];
      resources.push({
        label: resource.title,
        value: resource.name,
      });
    }
    scope.utils.eachComponent(scope.form.components, (component) => {
      if (['button'].indexOf(component.type) !== -1) {
        return;
      }
      fields.push({
        label: component.label || component.key,
        value: component.key,
      });
    });
    return [
      {
        type: 'select',
        label: 'Resources',
        key: 'resources',
        placeholder: 'Select the resources we should login against.',
        dataSrc: 'json',
        valueProperty: 'value',
        data: { json: resources },
        multiple: true,
        validate: {
          required: true,
        },
      },
      {
        type: 'select',
        input: true,
        label: 'Username Field',
        key: 'username',
        placeholder: 'Select the username field',
        dataSrc: 'json',
        valueProperty: 'value',
        data: { json: fields },
        multiple: false,
        validate: {
          required: true,
        },
      },
      {
        type: 'select',
        label: 'Password Field',
        key: 'password',
        placeholder: 'Select the password field',
        dataSrc: 'json',
        valueProperty: 'value',
        data: { json: fields },
        multiple: false,
        validate: {
          required: true,
        },
      },
      {
        type: 'textfield',
        key: 'allowedAttempts',
        input: true,
        label: 'Maximum Login Attempts',
        description: 'Use 0 for unlimited attempts',
        defaultValue: '5',
      },
      {
        type: 'textfield',
        key: 'attemptWindow',
        input: true,
        label: 'Login Attempt Time Window',
        description: 'This is the window of time to count the login attempts.',
        defaultValue: '30',
        suffix: 'seconds',
      },
      {
        type: 'textfield',
        key: 'lockWait',
        input: true,
        label: 'Locked Account Wait Time',
        description:
          'The amount of time a person needs to wait before they can try to login again.',
        defaultValue: '1800',
        suffix: 'seconds',
      },
    ];
  },

  /**
   * Format a string to show how long one must wait.
   *
   * @param time - In seconds.
   * @returns {string}
   */
  waitText(time) {
    return time > 60 ? `${parseInt(time / 60, 10)} minutes` : `${parseInt(time, 10)} seconds`;
  },

  /**
   * Checks the login attempts for a certain login.
   *
   * @param user
   * @param next
   * @returns {*}
   */
  async checkAttempts(scope, error, user) {
    const action = scope.action;
    if (!user || !user._id || !action.settings.allowedAttempts) {
      return;
    }

    const allowedAttempts = parseInt(action.settings.allowedAttempts, 10);
    if (Number.isNaN(allowedAttempts) || allowedAttempts === 0) {
      return;
    }

    // Initialize the login metadata.
    if (!has(user, 'metadata.login')) {
      set(user, 'metadata.login', {});
    }

    const now = new Date().getTime();
    const { login: loginMetadata } = user.metadata;
    const lastAttempt = parseInt(loginMetadata.last, 10) || 0;

    // See if the login is locked.
    if (loginMetadata.locked) {
      // Get how long they must wait to be locked out.
      let lockWait = parseInt(action.settings.lockWait, 10) || 1800;

      // Normalize to milliseconds.
      lockWait *= 1000;

      // See if the time has expired.
      if (lastAttempt + lockWait < now) {
        // Reset the locked state and attempts totals.
        loginMetadata.attempts = 0;
        loginMetadata.locked = false;
        loginMetadata.last = now;
      } else {
        const howLong = lastAttempt + lockWait - now;
        return `You must wait ${LoginAction.waitText(howLong / 1000)} before you can login.`;
      }
    } else if (error) {
      let attemptWindow = parseInt(action.settings.attemptWindow, 10) || 30;

      // Normalize to milliseconds.
      attemptWindow *= 1000;

      // Determine the login attempts within a certain window.
      const withinWindow = lastAttempt ? lastAttempt + attemptWindow > now : false;

      if (withinWindow) {
        const attempts = (parseInt(loginMetadata.attempts, 10) || 0) + 1;

        // If they exceeded the login attempts.
        if (attempts >= allowedAttempts) {
          const lockWait = parseInt(action.settings.lockWait, 10) || 1800;
          error = `Maximum Login attempts. Please wait ${LoginAction.waitText(lockWait)} before trying again.`;
          loginMetadata.locked = true;
        }

        // Set the login attempts.
        loginMetadata.attempts = attempts;
      } else {
        loginMetadata.attempts = 0;
        loginMetadata.last = now;
      }
    } else {
      // If there was no error, then reset the attempts to zero.
      loginMetadata.attempts = 0;
      loginMetadata.last = now;
    }

    // Update the user record
    await scope.db.update(scope, user._id.toString(), user);
    return error;
  },

  /**
   * Returns the action middleware.
   *
   * @param {*} scope
   */
  async executor(scope) {
    const action = scope.action;
    const userfield = action.settings.username;
    const passfield = action.settings.password;
    const forms = await scope.utils.getForms(scope, action.settings.resources);
    return async (req, res, next) => {
      debug('Login Action');
      const username = get(req.body?.data, userfield);
      const password = get(req.body?.data, passfield);
      if (!username) {
        error('Missing username');
        return next('Missing username');
      }
      if (!password) {
        error('Missing password');
        return next('Missing password');
      }

      // Find the user
      debug('Finding user', `${userfield} = ${username}`);
      const user = await scope.utils.findUser(scope, forms, `data.${userfield}`, username);
      if (!user) {
        error('User not found');
        return next('User or password was incorrect');
      }

      // Get the current password hash.
      const hash = get(user.data, passfield);
      if (!hash || !hash.hash) {
        error('User does not have a password');
        return next(
          'Your account does not have a password. You must reset your password to login.',
        );
      }

      // Compare with bcrypt.
      debug('Comparing password');
      bcrypt.compare(password, hash.hash, async (err, value) => {
        if (err) {
          error(err);
          return next(err);
        }

        // Check the login attempts.
        const error = await LoginAction.checkAttempts(scope, !value, user);
        if (error) {
          error(error);
          return next(error === true ? 'User or password was incorrect' : error);
        }

        // Unset the password field before we create a token from it.
        unset(user.data, passfield);

        // Set the user object.
        req.user = user;
        req.token = await scope.auth.token(
          scope.utils.tokenFromUser(user),
          scope.config.auth.secret,
          scope.config.auth.expire,
        );

        // Set the auth headers.
        res.setHeader('x-jwt-token', req.token);
        req.headers['x-jwt-token'] = req.token;
        if (res.resource) {
          res.resource.item = req.user;
        } else {
          res.resource = { status: 200, item: req.user };
        }
        debug('Login Successful', req.user);
        next();
      });
    };
  },
};

module.exports = LoginAction;
