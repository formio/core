import fetchPonyfill from 'fetch-ponyfill';
import { fastCloneDeep } from '../utils/fastCloneDeep';
import { get, defaults, isBoolean, isNil, isObject, intersection } from 'lodash';
import { eachComponent } from 'utils/formUtil';
import { jwtDecode } from 'utils/jwtDecode';
import EventEmitter from 'eventemitter3';
import cookies from 'browser-cookies';
const { fetch, Headers } = fetchPonyfill();
import Plugins from './Plugins';
import { attachResourceToDom } from 'utils';
declare const OktaAuth: any;

/**
 * The Formio class options interface.
 */
export interface FormioOptions {
  /**
   * The base API url of the Form.io Platform. Example: https://api.form.io
   */
  base?: string;

  /**
   * The project API url of the Form.io Project. Example: https://examples.form.io
   */
  project?: string;

  useSessionToken?: boolean;
}

/**
 * The different path types for a project.
 */
export enum FormioPathType {
  Subdirectories = 'Subdirectories',
  Subdomains = 'Subdomains',
}

/**
 * The Formio interface class. This is a minimalistic API library that allows you to work with the Form.io API's within JavaScript.
 *
 * ## Usage
 * Creating an instance of Formio is simple, and takes only a path (URL String). The path can be different, depending on the desired output.
 * The Formio instance can also access higher level operations, depending on how granular of a path you start with.
 *
 * ```ts
 * var formio = new Formio(<endpoint>, [options]);
 * ```
 *
 * Where **endpoint** is any valid API endpoint within Form.io. These URL's can provide a number of different methods depending on the granularity of the endpoint. This allows you to use the same interface but have access to different methods depending on how granular the endpoint url is.
 * **options** is defined within the {link Formio.constructor} documentation.
 *
 * Here is an example of how this library can be used to load a form JSON from the Form.io API's
 *
 * ```ts
 * const formio = new Formio('https://examples.form.io/example');
 * formio.loadForm().then((form) => {
 *   console.log(form);
 * });
 * ```
 */
export class Formio {
  /**
   * The base API url of the Form.io Platform. Example: https://api.form.io
   */
  public static baseUrl = 'https://api.form.io';

  /**
   * The project API url of the Form.io Project. Example: https://examples.form.io
   */
  public static projectUrl = '';

  /**
   * The project url to use for Authentication.
   */
  public static authUrl = '';

  /**
   * The path type for the project.
   */
  public static pathType?: FormioPathType;

  /**
   * Set to true if the project url has been established with ```Formio.setProjectUrl()```
   */
  public static projectUrlSet = false;

  /**
   * The Form.io API Cache. This ensures that requests to the same API endpoint are cached.
   */
  public static cache: any = {};

  /**
   * The namespace used to save the Form.io Token's and variables within an application.
   */
  public static namespace: string = '';

  /**
   * Handles events fired within this SDK library.
   */
  public static events: EventEmitter = new EventEmitter();

  /**
   * Stores all of the libraries lazy loaded with ```Formio.requireLibrary``` method.
   */
  public static libraries: any = {};

  /**
   * A direct interface to the Form.io fetch polyfill.
   */
  public static fetch: any = fetch;

  /**
   * A direct interface to the Form.io fetch Headers polyfill.
   */
  public static Headers: any = Headers;

  /**
   * All of the auth tokens for this session.
   */
  public static tokens: any = {};

  /**
   * The version of this library.
   */
  public static version: string = '---VERSION---';

  /**
   * The global options for the Formio library.
   */
  public static options: any = {};

  /**
   * The base API url of the Form.io Platform. Example: https://api.form.io
   */
  public base = '';

  /**
   * The Projects Endpoint derived from the provided source.
   *
   * @example https://api.form.io/project
   */
  public projectsUrl = '';

  /**
   * A specific project endpoint derived from the provided source.
   *
   * @example https://examples.form.io
   */
  public projectUrl = '';

  /**
   * The Project ID found within the provided source.
   */
  public projectId = '';

  /**
   * A specific Role URL provided the source.
   *
   * @example https://examples.form.io/role/2342343234234234
   */
  public roleUrl = '';

  /**
   * The roles endpoint derived from the provided source.
   *
   * @example https://examples.form.io/role
   */
  public rolesUrl = '';

  /**
   * The roleID derieved from the provided source.
   */
  public roleId = '';

  /**
   * A specific form url derived from the provided source.
   *
   * @example https://examples.form.io/example
   */
  public formUrl = '';

  /**
   * The forms url derived from the provided source.
   *
   * @example https://example.form.io/form
   */
  public formsUrl = '';

  /**
   * The Form ID derived from the provided source.
   */
  public formId = '';

  /**
   * The submissions URL derived from the provided source.
   *
   * @example https://examples.form.io/example/submission
   */
  public submissionsUrl = '';

  /**
   * A specific submissions URL derived from a provided source.
   *
   * @example https://examples.form.io/example/submission/223423423423
   */
  public submissionUrl = '';

  /**
   * The submission ID provided a submission url.
   */
  public submissionId = '';

  /**
   * The actions url provided a form url as the source.
   *
   * @example https://examples.form.io/example/action
   */
  public actionsUrl = '';

  /**
   * The Action ID derived from a provided Action url.
   */
  public actionId = '';

  /**
   * A specific action api endoint.
   */
  public actionUrl = '';
  public vsUrl = '';
  public vId = '';
  public vUrl = '';

  /**
   * The query string derived from the provided src url.
   */
  public query = '';

  /**
   * The project type.
   */
  public pathType?: FormioPathType;

  /**
   * If this is a non-project url, such is the case for Open Source API.
   */
  public noProject = false;

  /**
   * @constructor
   * @param {string} path - A project, form, and submission API Url.
   * @param {FormioOptions} options - Available options to configure the Javascript API.
   */
  constructor(
    public path?: string,
    public options: FormioOptions = {},
  ) {
    // Ensure we have an instance of Formio.
    if (!(this instanceof Formio)) {
      return new Formio(path);
    }

    if (options.useSessionToken) {
      Formio.useSessionToken(options as any);
    }
    if (options.hasOwnProperty('base') && options.base) {
      this.base = options.base;
    } else if (Formio.baseUrl) {
      this.base = Formio.baseUrl;
    } else if (window && window.location) {
      const match = window.location.href.match(/http[s]?:\/\/api./);
      this.base = match ? match[0] : window.location.origin;
    }

    if (!path) {
      // Allow user to create new projects if this was instantiated without
      // a url
      this.projectUrl = Formio.projectUrl || `${this.base}/project`;
      this.projectsUrl = `${this.base}/project`;
      this.projectId = '';
      this.query = '';
      return;
    }

    if (options.hasOwnProperty('project') && options.project) {
      this.projectUrl = options.project;
    }

    const project = this.projectUrl || Formio.projectUrl;
    const projectRegEx = /(^|\/)(project)($|\/[^/]+)/;
    const isProjectUrl = path.search(projectRegEx) !== -1;

    // The baseURL is the same as the projectUrl, and does not contain "/project/MONGO_ID" in
    // its domain. This is almost certainly against the Open Source server.
    if (project && this.base === project && !isProjectUrl) {
      this.noProject = true;
      this.projectUrl = this.base;
    }

    // Normalize to an absolute path.
    if (path.indexOf('http') !== 0 && path.indexOf('//') !== 0) {
      path = this.base + path;
    }

    const hostparts = this.getUrlParts(path);
    let hostName = '';
    let parts: any = [];
    if (hostparts) {
      hostName = hostparts[1] + hostparts[2];
      path = hostparts.length > 3 ? hostparts[3] : '';
      const queryparts = path.split('?');
      if (queryparts.length > 1) {
        path = queryparts[0];
        this.query = `?${queryparts[1]}`;
      }
    }

    // Register a specific path.
    const registerPath = (name: string, base: string) => {
      (this as any)[`${name}sUrl`] = `${base}/${name}`;
      const regex = new RegExp(`/${name}/([^/]+)`);
      if (path && path.search(regex) !== -1) {
        parts = path.match(regex);
        (this as any)[`${name}Url`] = parts ? base + parts[0] : '';
        (this as any)[`${name}Id`] = parts.length > 1 ? parts[1] : '';
        base += parts[0];
      }
      return base;
    };

    // Register an array of items.
    const registerItems = (items: any, base: string, staticBase?: boolean) => {
      for (const i in items) {
        if (items.hasOwnProperty(i)) {
          const item = items[i];
          if (Array.isArray(item)) {
            registerItems(item, base, true);
          } else {
            const newBase = registerPath(item, base);
            base = staticBase ? base : newBase;
          }
        }
      }
    };

    if (!this.projectUrl || this.projectUrl === this.base) {
      // If a project uses Subdirectories path type, we need to specify a projectUrl
      if (!this.projectUrl && !isProjectUrl && Formio.pathType === 'Subdirectories') {
        const regex = `^${hostName.replace(/\//g, '\\/')}.[^/]+`;
        const match = project.match(new RegExp(regex));
        this.projectUrl = match ? match[0] : hostName;
      } else {
        this.projectUrl = hostName;
      }
    }
    // Check if we have a specified path type.
    let isNotSubdomainType = false;

    if (Formio.pathType) {
      isNotSubdomainType = Formio.pathType !== 'Subdomains';
    }

    if (!this.noProject) {
      // Determine the projectUrl and projectId
      if (isProjectUrl) {
        // Get project id as project/:projectId.
        registerItems(['project'], hostName);
        path = path.replace(projectRegEx, '');
      } else if (hostName === this.base) {
        // Get project id as first part of path (subdirectory).
        if (hostparts && hostparts.length > 3 && path.split('/').length > 1) {
          const isFile = path.match(/.json/);
          const pathParts = path.split('/');
          if (isFile) {
            this.projectUrl = hostName;
          } else {
            pathParts.shift(); // Throw away the first /.
            const projectId = pathParts.shift();
            if (projectId) {
              this.projectId = projectId;
              path = `/${pathParts.join('/')}`;
              this.projectUrl = `${hostName}/${this.projectId}`;
            }
          }
        }
      } else {
        // Get project id from subdomain.
        if (
          hostparts &&
          hostparts.length > 2 &&
          (hostparts[2].split('.').length > 2 || hostName.includes('localhost')) &&
          !isNotSubdomainType
        ) {
          this.projectUrl = hostName;
          this.projectId = hostparts[2].split('.')[0];
        }
      }
      this.projectsUrl = this.projectsUrl || `${this.base}/project`;
    }

    // Configure Role urls and role ids.
    registerItems(['role'], this.projectUrl);

    // Configure Form urls and form ids.
    if (/(^|\/)(form)($|\/)/.test(path)) {
      registerItems(['form', ['submission', 'action', 'v']], this.projectUrl);
    } else {
      const subRegEx = new RegExp('/(submission|action|v)($|/.*)');
      const subs = path.match(subRegEx);
      if (subs && subs.length > 1) {
        this.pathType = subs[1] as FormioPathType;
      }
      path = path.replace(subRegEx, '');
      path = path.replace(/\/$/, '');
      this.formsUrl = `${this.projectUrl}/form`;
      this.formUrl = path ? this.projectUrl + path : '';
      this.formId = path.replace(/^\/+|\/+$/g, '');
      const items = ['submission', 'action', 'v'];
      for (const i in items) {
        if (items.hasOwnProperty(i)) {
          const item = items[i];
          (this as any)[`${item}sUrl`] = `${this.projectUrl + path}/${item}`;
          if (this.pathType === item && subs && subs.length > 2 && subs[2]) {
            (this as any)[`${item}Id`] = subs[2].replace(/^\/+|\/+$/g, '');
            (this as any)[`${item}Url`] = this.projectUrl + path + subs[0];
          }
        }
      }
    }

    // Set the app url if it is not set.
    if (!Formio.projectUrlSet) {
      Formio.projectUrl = this.projectUrl;
    }
  }

  /**
   * Deletes a remote resource of any provided type.
   *
   * @param {string} type - The type of resource to delete. "submission", "form", etc.
   * @param {object} options - The options passed to {@link Formio.request}
   * @return {Promise<Response>}
   */
  delete(type: string, opts?: any) {
    const _id = `${type}Id`;
    const _url = `${type}Url`;
    if (!(this as any)[_id]) {
      return Promise.reject('Nothing to delete');
    }
    Formio.cache = {};
    return this.makeRequest(type, (this as any)[_url], 'delete', null, opts);
  }

  /**
   * Returns the index (array of records) for any provided type.
   *
   * @param {string} type - The type of resource to fetch the index of. "submission", "form", etc.
   * @param {object} query - A query object to pass to the request.
   * @param {object} query.params - A map (key-value pairs) of URL query parameters to add to the url.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Response>}
   */
  index(type: string, query?: any, opts?: any) {
    const _url = `${type}Url`;
    query = query || '';
    if (query && isObject(query)) {
      query = `?${Formio.serialize((query as any).params)}`;
    }
    return this.makeRequest(type, (this as any)[_url] + query, 'get', null, opts);
  }

  /**
   * Save a document record using "upsert". If the document does not exist, it will be created, if the _id is provided,
   * it will be updated.
   *
   * @param {string} type - The type of resource to fetch the index of. "submission", "form", etc.
   * @param {object} data - The resource data object.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<object>}
   */
  save(type: string, data?: any, opts?: any) {
    const _id = `${type}Id`;
    const _url = `${type}Url`;
    const method = (this as any)[_id] || data._id ? 'put' : 'post';
    let reqUrl = (this as any)[_id] ? (this as any)[_url] : (this as any)[`${type}sUrl`];
    if (!(this as any)[_id] && data._id && method === 'put' && !reqUrl.includes(data._id)) {
      reqUrl += `/${data._id}`;
    }
    Formio.cache = {};
    return this.makeRequest(type, reqUrl + this.query, method, data, opts);
  }

  /**
   * @summary Load (GET) a document record.
   *
   * @param {string} type - The type of resource to fetch the index of. "submission", "form", etc.
   * @param {object} query - A query object to pass to the request.
   * @param {object} query.params - A map (key-value pairs) of URL query parameters to add to the url.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<object>}
   */
  load(type: string, query?: any, opts?: any) {
    const _id = `${type}Id`;
    const _url = `${type}Url`;
    if (query && isObject(query)) {
      query = Formio.serialize((query as any).params);
    }
    if (query) {
      query = this.query ? `${this.query}&${query}` : `?${query}`;
    } else {
      query = this.query;
    }
    if (!(this as any)[_id]) {
      return Promise.reject(`Missing ${_id}`);
    }

    let url = (this as any)[_url] + query;
    if (type === 'form' && !isNaN(parseInt(this.vId))) {
      url += url.indexOf('?') === -1 ? '?' : '&';
      url += `formRevision=${this.vId}`;
    }
    return this.makeRequest(type, url, 'get', null, opts);
  }

  /**
   * @summary Call {@link Formio.makeRequest} for this Formio instance.
   *
   * @param {string} type - The request resource type. "submission", "form", etc.
   * @param {string} url - The URL to request.
   * @param {string} method - The request method. GET, PUT, POST, DELETE, or PATCH
   * @param {object} data - The data to pass to the request (for PUT, POST, and PATCH methods)
   * @param {object} options - An object of options to pass to the request method.
   * @param {boolean} options.ignoreCache - To ignore internal caching of the request.
   * @param {object} options.headers - An object of headers to pass along to the request.
   * @param {boolean} options.noToken - If set to true, this will not include the Form.io x-jwt-token along with the request.
   * @param {string} options.namespace - The Form.io namespace to prepend to all LocalStorage variables such as formioToken.
   * @param {boolean} options.getHeaders - Set this if you wish to include the response headers with the return of this method.
   * @return {Promise<Response>}
   */
  makeRequest(type: string, url: string, method?: string, data?: any, opts?: any) {
    return Formio.makeRequest(this, type, url, method, data, opts);
  }

  /**
   * @summary Loads a project.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io');
   * formio.loadProject().then((project) => {
   *   console.log(project);
   * });
   * ```
   *
   * @param {object} query - Query parameters to pass to {@link Formio#load}.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Object>}
   */
  loadProject(query?: any, opts?: any) {
    return this.load('project', query, opts);
  }

  /**
   * Saves or Updates a project.
   *
   * ### Create a new project
   * ```ts
   * const formio = new Formio();
   * formio.saveProject({
   *   title: 'My Project',
   *   path: 'myproject',
   *   name: 'myproject'
   * });
   * ```
   *
   * ### Update an existing project
   * ```ts
   * const formio = new Formio('https://examples.form.io');
   * formio.loadProject().then((project) => {
   *   project.title = 'Title changed';
   *   formio.saveProject(project).then(() => {
   *     console.log('Done saving project!');
   *   });
   * });
   * ```
   *
   * @param {object} data - The project JSON to create or update.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Object>}
   */
  saveProject(data?: any, opts?: any) {
    return this.save('project', data, opts);
  }

  /**
   * Deletes a project
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io');
   * formio.deleteProject();
   * ```
   *
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Object>}
   */
  deleteProject(opts?: any) {
    return this.delete('project', opts);
  }

  /**
   * Loads a list of all projects.
   *
   * ```ts
   * Formio.loadProjects().then((projects) => {
   *   console.log(projects);
   * });
   * ```
   *
   * @param {object} query - Query parameters similar to {@link Formio#load}.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {*}
   */
  static loadProjects(query?: any, opts?: any) {
    query = query || '';
    if (isObject(query)) {
      query = `?${Formio.serialize((query as any).params)}`;
    }
    return Formio.makeStaticRequest(`${Formio.baseUrl}/project${query}`, 'GET', null, opts);
  }

  /**
   * Loads a role within a project.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io/role/234234234234');
   * formio.loadRole().then((role) => {
   *   console.log(role);
   * });
   * ```
   *
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Object>}
   */
  loadRole(opts?: any) {
    return this.load('role', null, opts);
  }

  /**
   * Create a new or Update an existing role within a project.
   *
   * ### Create new Role example
   * ```ts
   * const formio = new Formio('https://examples.form.io');
   * formio.saveRole({
   *   title: 'Employee',
   *   description: 'A person who belongs to a company.'
   * }).then((role) => {
   *   console.log(role);
   * });
   * ```
   *
   * ### Update existing role example
   * ```ts
   * const formio = new Formio('https://examples.form.io/role/234234234234234');
   * formio.loadRole().then((role) => {
   *   role.title = 'Manager';
   *   formio.saveRole(role).then(() => {
   *     console.log('DONE');
   *   });
   * });
   * ```
   *
   * @param {object} role - The Role JSON to create or update.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Object>}
   */
  saveRole(data?: any, opts?: any) {
    return this.save('role', data, opts);
  }

  /**
   * Deletes a role within a project.
   *
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Response>}
   */
  deleteRole(opts?: any) {
    return this.delete('role', opts);
  }

  /**
   * Load all roles within a project.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io');
   * formio.loadRoles().then((roles) => {
   *   console.log(roles);
   * });
   * ```
   *
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Response>}
   */
  loadRoles(opts?: any) {
    return this.index('roles', null, opts);
  }

  /**
   * Loads a form.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io/example');
   * formio.loadForm().then((form) => {
   *   console.log(form);
   * });
   * ```
   *
   * @param {object} query - Query parameters similar to {@link Formio#load}.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<object>}
   */
  loadForm(query?: any, opts?: any) {
    return this.load('form', query, opts).then((currentForm: any) => {
      // Check to see if there isn't a number in vId.
      if (!currentForm.revisions || isNaN(parseInt(this.vId))) {
        return currentForm;
      }
      // If a submission already exists but form is marked to load current version of form.
      if (currentForm.revisions === 'current' && this.submissionId) {
        return currentForm;
      }

      if (currentForm._vid == this.vId || currentForm.revisionId === this.vId) {
        return currentForm;
      }
      // If they specified a revision form, load the revised form components.
      if (query && isObject(query)) {
        query = Formio.serialize((query as any).params);
      }
      if (query) {
        query = this.query ? `${this.query}&${query}` : `?${query}`;
      } else {
        query = this.query;
      }
      return (
        this.makeRequest('form', this.vUrl + query, 'get', null, opts)
          .then((revisionForm: any) => {
            currentForm._vid = revisionForm._vid;
            currentForm.components = revisionForm.components;
            currentForm.settings = revisionForm.settings;
            currentForm.revisionId = revisionForm.revisionId;
            // Using object.assign so we don't cross polinate multiple form loads.
            return Object.assign({}, currentForm);
          })
          // If we couldn't load the revision, just return the original form.
          .catch(() => Object.assign({}, currentForm))
      );
    });
  }

  /**
   * Create or Update a specific form.
   *
   * ### Create form example
   * ```ts
   * const formio = new Formio('https://examples.form.io');
   * formio.saveForm({
   *   title: 'Employee',
   *   type: 'resource',
   *   path: 'employee',
   *   name: 'employee',
   *   components: [
   *     {
   *       type: 'textfield',
   *       key: 'firstName',
   *       label: 'First Name'
   *     },
   *     {
   *       type: 'textfield',
   *       key: 'lastName',
   *       label: 'Last Name'
   *     }
   *   ]
   * });
   * ```
   *
   * ### Update a form example
   * ```ts
   * const formio = new Formio('https://examples.form.io/example');
   * formio.loadForm().then((form) => {
   *   form.title = 'Changed Title';
   *   formio.saveForm(form).then(() => {
   *     console.log('DONE!!!');
   *   });
   * });
   * ```
   *
   * @param {object} data - The Form JSON to create or update.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Object>}
   */
  saveForm(data?: any, opts?: any) {
    return this.save('form', data, opts);
  }

  /**
   * Deletes a form.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io/example');
   * formio.deleteForm().then(() => {
   *   console.log('Deleted!');
   * });
   * ```
   *
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Response>}
   */
  deleteForm(opts?: any) {
    return this.delete('form', opts);
  }

  /**
   * Loads all forms within a project.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io');
   * formio.loadForms().then((forms) => {
   *   console.log(forms);
   * });
   * ```
   *
   * @param {object} query - Query parameters similar to {@link Formio#load}.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Response>}
   */
  loadForms(query?: any, opts?: any) {
    return this.index('forms', query, opts);
  }

  /**
   * Loads a specific submissionn.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io/example/submission/23423423423423423');
   * formio.loadSubmission().then((submission) => {
   *   console.log(submission);
   * });
   * ```
   *
   * @param {object} query - Query parameters similar to {@link Formio#load}.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<object>}
   */
  loadSubmission(query?: any, opts?: any) {
    return this.load('submission', query, opts).then((submission: any) => {
      this.vId = submission._frid || submission._fvid;
      this.vUrl = `${this.formUrl}/v/${this.vId}`;
      return submission;
    });
  }

  /**
   * Creates a new or Updates an existing submission.
   *
   * ### Create a new submission
   * ```ts
   * const formio = new Formio('https://examples.form.io/example');
   * formio.saveSubmission({
   *   data: {
   *     firstName: 'Joe',
   *     lastName: 'Smith'
   *   }
   * }).then((submission) => {
   *   // This will now be the complete submission object saved on the server.
   *   console.log(submission);
   * });
   * ```
   *
   * ### Update an existing submission
   * ```ts
   * const formio = new Formio('https://examples.form.io/example/submission/23423423423423423');
   * formio.loadSubmission().then((submission) => {
   *   submission.data.lastName = 'Thompson';
   *   formio.saveSubmission(submission).then(() => {
   *     console.log('DONE');
   *   });
   * });
   * ```
   *
   * @param {object} data - The submission JSON object.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Object>}
   */
  saveSubmission(data?: any, opts?: any) {
    if (!isNaN(parseInt(this.vId)) && !data._fvid) {
      data._fvid = this.vId;
    }
    return this.save('submission', data, opts);
  }

  /**
   * Deletes a submission.
   *
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Response>}
   */
  deleteSubmission(opts?: any) {
    return this.delete('submission', opts);
  }

  /**
   * Loads all submissions within a form.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io/example');
   * formio.loadSubmissions({
   *   params: {
   *     limit: 25,
   *     'data.lastName__regex': 'smith'
   *   }
   * }).then((submissions) => {
   *   // Should print out 25 submissions where the last name contains "smith".
   *   console.log(submissions);
   * });
   * ```
   *
   * @param {object} query - Query parameters similar to {@link Formio#load}.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Response>}
   */
  loadSubmissions(query?: any, opts?: any) {
    return this.index('submissions', query, opts);
  }

  /**
   * Loads a form action.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io/example/action/234234234234');
   * formio.loadAction().then((action) => {
   *   console.log(action);
   * });
   * ```
   *
   * @param {object} query - Query parameters similar to {@link Formio#load}.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Object>}
   */
  loadAction(query?: any, opts?: any) {
    return this.load('action', query, opts);
  }

  /**
   * Create a new or update an existing action.
   *
   * ### Create a new action for a form.
   * ```ts
   * const formio = new Formio('https://examples.form.io/example');
   * formio.saveAction({
   *   data: {
   *     name: 'webhook',
   *     title: 'Webhook Action',
   *     method: ['create', 'update', 'delete'],
   *     handler: ['after'],
   *     condition: {},
   *     settings: {
   *       url: 'https://example.com',
   *       headers: [{}],
   *       block: false,
   *       forwardHeaders: false
   *     }
   *   }
   * }).then((action) => {
   *   console.log(action);
   * });
   * ```
   *
   * ### Update an action
   * ```ts
   * const formio = new Formio('https://examples.form.io/example/action/234234234234');
   * formio.loadAction().then((action) => {
   *   action.title = 'Updated title';
   *   formio.saveAction(action).then(() => {
   *     console.log('Done!');
   *   });
   * });
   * ```
   *
   * @param {object} data - The action JSON
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Object>}
   */
  saveAction(data?: any, opts?: any) {
    return this.save('action', data, opts);
  }

  /**
   * Delete an action
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io/example/action/234234234234');
   * formio.deleteAction().then(() => {
   *   console.log('Action was deleted.');
   * });
   * ```
   *
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Response>}
   */
  deleteAction(opts?: any) {
    return this.delete('action', opts);
  }

  /**
   * Loads all actions within a form.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io/example');
   * formio.loadActions().then((actions) => {
   *   console.log(actions);
   * });
   * ```
   *
   * @param {object} query - Query parameters similar to {@link Formio#load}.
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<Response>}
   */
  loadActions(query?: any, opts?: any) {
    return this.index('actions', query, opts);
  }

  /**
   * Returns a list of available actions
   *
   * @return {Promise<Response>}
   */
  availableActions() {
    return this.makeRequest('availableActions', `${this.formUrl}/actions`);
  }

  /**
   * Returns the action information for a specific action, such as "save".
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io/example/actions/save');
   * formio.actionInfo().then((info) => {
   *   console.log(info);
   * });
   * ```
   *
   * @param {string} name - The name of the action you would like to get information for. i.e. "save", "webhook", etc.
   * @return {Promise<Response>}
   */
  actionInfo(name: string) {
    return this.makeRequest('actionInfo', `${this.formUrl}/actions/${name}`);
  }

  /**
   * Determine if a string ID is a valid MongoID.
   *
   * @param {string} id - The id that should be tested if it is avalid id.
   * @return {boolean} - true if it is a valid MongoId, false otherwise.
   */
  isObjectId(id: string) {
    const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
    return checkForHexRegExp.test(id);
  }

  /**
   * Get the project ID of project.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io');
   * formio.getProjectId().then((projectId) => {
   *   console.log(projectId);
   * };
   * ```
   *
   * @return {Promise<string>}
   */
  getProjectId() {
    if (!this.projectId) {
      return Promise.resolve('');
    }
    if (this.isObjectId(this.projectId)) {
      return Promise.resolve(this.projectId);
    } else {
      return this.loadProject().then((project: any) => {
        return project._id;
      });
    }
  }

  /**
   * Get the ID of a form.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io/example');
   * formio.getFormId().then((formId) => {
   *   console.log(formId);
   * });
   * ```
   *
   * @return {Promise<string>}
   */
  getFormId() {
    if (!this.formId) {
      return Promise.resolve('');
    }
    if (this.isObjectId(this.formId)) {
      return Promise.resolve(this.formId);
    } else {
      return this.loadForm().then((form: any) => {
        return form._id;
      });
    }
  }

  /**
   * Instance method for {@link Formio.currentUser}
   *
   * @param {object} options - Options to pass to {@link Formio.request}
   * @return {Promise<object>}
   */
  currentUser(options?: any) {
    return Formio.currentUser(this, options);
  }

  /**
   * Instance method for {@link Formio.accessInfo}
   *
   * @return {Promise<Response>}
   */
  accessInfo() {
    return Formio.accessInfo(this);
  }

  /**
   * Sets OAuth Logout URL.
   *
   * @param {string} uri - Logout URL.
   * @param {string} options.namespace - The localStorage namespace to use when retrieving tokens from storage.
   * @return {string}
   */
  oauthLogoutURI(uri: string, options: string | { namespace: string }): string {
    return Formio.oauthLogoutURI(uri, Object.assign({ formio: this }, this.options, options));
  }

  /**
   * Returns the JWT token for this instance.
   *
   * @param {object} options - The following options are provided.
   * @param {string} options.namespace - The localStorage namespace to use when retrieving tokens from storage.
   * @return {string} - The JWT token for this user.
   */
  getToken(options?: any) {
    return Formio.getToken(Object.assign({ formio: this }, this.options, options));
  }

  /**
   * Sets the JWT token for this instance.
   *
   * @param {string} token - The JWT token to set.
   * @param {object} options - The following options are provided.
   * @param {string} options.namespace - The localStorage namespace to use when retrieving tokens from storage.
   * @return {string} - The JWT token that was set.
   */
  setToken(token: any, options?: any) {
    return Formio.setToken(token, Object.assign({ formio: this }, this.options, options));
  }

  /**
   * Returns a temporary authentication token for single purpose token generation.
   *
   * @param {number|string} expire - The amount of seconds to wait before this temp token expires.
   * @param {string} allowed - The allowed path string inn the format GET:/path
   * @param {object} options - The options passed to {@link Formio#getToken}
   */
  getTempToken(expire: any, allowed: string, options?: any) {
    const token = Formio.getToken(options);
    if (!token) {
      return Promise.reject('You must be authenticated to generate a temporary auth token.');
    }
    const authUrl = Formio.authUrl || this.projectUrl;
    return this.makeRequest('tempToken', `${authUrl}/token`, 'GET', null, {
      ignoreCache: true,
      header: new Headers({
        'x-expire': expire,
        'x-allow': allowed,
      }),
    });
  }

  /**
   * Get a PDF download url for a submission, which will generate a new PDF of the submission. This method will first
   * fetch a temporary download token, and then append this to the download url for this form.
   *
   * ```ts
   * const formio = new Formio('https://examples.form.io/example/submission/324234234234234');
   * formio.getDownloadUrl().then((url) => {
   *   console.log(url);
   * });
   * ```
   *
   * @param {object} [form] - The form JSON to fetch a download url for.
   * @return {Promise<string>} - The download url.
   */
  getDownloadUrl(form: any) {
    if (!this.submissionId) {
      return Promise.resolve('');
    }

    if (!form) {
      // Make sure to load the form first.
      return this.loadForm().then((_form: any) => {
        if (!_form) {
          return '';
        }
        return this.getDownloadUrl(_form);
      });
    }

    let apiUrl = `/project/${form.project}`;
    apiUrl += `/form/${form._id}`;
    apiUrl += `/submission/${this.submissionId}`;
    const postfix =
      form.submissionRevisions && form.settings.changeLog ? '/download/changelog' : '/download';
    apiUrl += postfix;

    let download = this.base + apiUrl;
    return new Promise((resolve, reject) => {
      this.getTempToken(3600, `GET:${apiUrl}`)
        .then(
          (tempToken: any) => {
            download += `?token=${tempToken.key}`;
            resolve(download);
          },
          () => {
            resolve(download);
          },
        )
        .catch(reject);
    });
  }

  /**
   * Returns the user permissions to a form and submission.
   *
   * @param user - The user or current user if undefined. For anonymous, use "null"
   * @param form - The form or current form if undefined. For no form check, use "null"
   * @param submission - The submisison or "index" if undefined.
   *
   * @return {{create: boolean, read: boolean, edit: boolean, delete: boolean}}
   */
  userPermissions(user?: any, form?: any, submission?: any) {
    return Promise.all([
      form !== undefined ? Promise.resolve(form) : this.loadForm(),
      user !== undefined ? Promise.resolve(user) : this.currentUser(),
      submission !== undefined || !this.submissionId
        ? Promise.resolve(submission)
        : this.loadSubmission(),
      this.accessInfo(),
    ]).then((results: any) => {
      const form = results.shift();
      const user = results.shift() || { _id: false, roles: [] };
      const submission = results.shift();
      const access = results.shift();
      const permMap: any = {
        create: 'create',
        read: 'read',
        update: 'edit',
        delete: 'delete',
      };
      const perms: any = {
        user: user,
        form: form,
        access: access,
        create: false,
        read: false,
        edit: false,
        delete: false,
      };
      for (const roleName in access.roles) {
        if (access.roles.hasOwnProperty(roleName)) {
          const role = access.roles[roleName];
          if (role.default && user._id === false) {
            // User is anonymous. Add the anonymous role.
            user.roles.push(role._id);
          } else if (role.admin && user.roles.indexOf(role._id) !== -1) {
            perms.create = true;
            perms.read = true;
            perms.delete = true;
            perms.edit = true;
            return perms;
          }
        }
      }
      if (form && form.submissionAccess) {
        for (let i = 0; i < form.submissionAccess.length; i++) {
          const permission = form.submissionAccess[i];
          const [perm, scope] = permission.type.split('_');
          if (['create', 'read', 'update', 'delete'].includes(perm)) {
            if (intersection(permission.roles, user.roles).length) {
              perms[permMap[perm]] =
                scope === 'all' || !submission || user._id === submission.owner;
            }
          }
        }
      }
      // check for Group Permissions
      if (submission) {
        // we would anyway need to loop through components for create permission, so we'll do that for all of them
        eachComponent(form.components, (component: any, path: string) => {
          if (component && component.defaultPermission) {
            const value = get(submission.data, path);
            // make it work for single-select Group and multi-select Group
            const groups = Array.isArray(value) ? value : [value];
            groups.forEach((group) => {
              if (
                group &&
                group._id && // group id is present
                user.roles.indexOf(group._id) > -1 // user has group id in his roles
              ) {
                if (component.defaultPermission === 'read') {
                  perms[permMap.read] = true;
                }
                if (component.defaultPermission === 'create') {
                  perms[permMap.create] = true;
                  perms[permMap.read] = true;
                }
                if (component.defaultPermission === 'write') {
                  perms[permMap.create] = true;
                  perms[permMap.read] = true;
                  perms[permMap.update] = true;
                }
                if (component.defaultPermission === 'admin') {
                  perms[permMap.create] = true;
                  perms[permMap.read] = true;
                  perms[permMap.update] = true;
                  perms[permMap.delete] = true;
                }
              }
            });
          }
        });
      }
      return perms;
    });
  }

  /**
   * `Determine if the current user can submit a form.
   * @return {*}
   */
  canSubmit() {
    return this.userPermissions().then((perms) => {
      // If there is user and they cannot create, then check anonymous user permissions.
      if (!perms.create && Formio.getUser()) {
        return this.userPermissions(null).then((anonPerms) => {
          if (anonPerms.create) {
            Formio.setUser(null);
            return true;
          }

          return false;
        });
      }

      return perms.create;
    });
  }

  getUrlParts(url: string) {
    return Formio.getUrlParts(url, this);
  }

  static getUrlParts(url: string, formio: any) {
    const base = formio && formio.base ? formio.base : Formio.baseUrl;
    let regex = '^(http[s]?:\\/\\/)';
    if (base && url.indexOf(base) === 0) {
      regex += `(${base.replace(/^http[s]?:\/\//, '')})`;
    } else {
      regex += '([^/]+)';
    }
    regex += '($|\\/.*)';
    return url.match(new RegExp(regex));
  }

  static serialize(obj: any, _interpolate?: any) {
    const str: string[] = [];
    const interpolate = (item: any) => {
      return _interpolate ? _interpolate(item) : item;
    };
    for (const p in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, p)) {
        str.push(`${encodeURIComponent(p)}=${encodeURIComponent(interpolate(obj[p]))}`);
      }
    }
    return str.join('&');
  }

  static getRequestArgs(
    formio: any,
    type: string,
    url: string,
    method?: any,
    data?: any,
    opts?: any,
  ) {
    method = (method || 'GET').toUpperCase();
    if (!opts || !isObject(opts)) {
      opts = {};
    }

    const requestArgs: any = {
      url,
      method,
      data: data || null,
      opts,
    };

    if (type) {
      requestArgs.type = type;
    }

    if (formio) {
      requestArgs.formio = formio;
    }
    return requestArgs;
  }

  static makeStaticRequest(url: string, method?: any, data?: any, opts?: any) {
    const requestArgs = Formio.getRequestArgs(null, '', url, method, data, opts);
    const request = Plugins.pluginWait('preRequest', requestArgs).then(() =>
      Plugins.pluginGet('staticRequest', requestArgs).then((result: any) => {
        if (isNil(result)) {
          return Formio.request(
            requestArgs.url,
            requestArgs.method,
            requestArgs.data,
            requestArgs.opts.header,
            requestArgs.opts,
          );
        }
        return result;
      }),
    );

    return Plugins.pluginAlter('wrapStaticRequestPromise', request, requestArgs);
  }

  /**
   * Make an API request and wrap that request with the Form.io Request plugin system.  This is very similar to the
   * {Formio.request} method with a difference being that it will pass the request through the Form.io request plugin.
   *
   * @param {Formio} formio - An instance of the Formio class.
   * @param {string} type - The request resource type. "submission", "form", etc.
   * @param {string} url - The URL to request.
   * @param {string} method - The request method. GET, PUT, POST, DELETE, or PATCH
   * @param {object} data - The data to pass to the request (for PUT, POST, and PATCH methods)
   * @param {object} options - An object of options to pass to the request method.
   * @param {boolean} options.ignoreCache - To ignore internal caching of the request.
   * @param {object} options.headers - An object of headers to pass along to the request.
   * @param {boolean} options.noToken - If set to true, this will not include the Form.io x-jwt-token along with the request.
   * @param {string} options.namespace - The Form.io namespace to prepend to all LocalStorage variables such as formioToken.
   * @param {boolean} options.getHeaders - Set this if you wish to include the response headers with the return of this method.
   * @return {Promise<Response>}
   */
  static makeRequest(
    formio: any,
    type: string,
    url: string,
    method?: string,
    data?: any,
    opts?: any,
  ) {
    if (!formio) {
      return Formio.makeStaticRequest(url, method, data, opts);
    }

    const requestArgs = Formio.getRequestArgs(formio, type, url, method, data, opts);
    requestArgs.opts = requestArgs.opts || {};
    requestArgs.opts.formio = formio;

    //for Formio requests default Accept and Content-type headers
    if (!requestArgs.opts.headers) {
      requestArgs.opts.headers = {};
    }
    requestArgs.opts.headers = defaults(requestArgs.opts.headers, {
      Accept: 'application/json',
      'Content-type': 'application/json',
    });
    const request = Plugins.pluginWait('preRequest', requestArgs).then(() =>
      Plugins.pluginGet('request', requestArgs).then((result: any) => {
        if (isNil(result)) {
          return Formio.request(
            requestArgs.url,
            requestArgs.method,
            requestArgs.data,
            requestArgs.opts.header,
            requestArgs.opts,
          );
        }
        return result;
      }),
    );

    return Plugins.pluginAlter('wrapRequestPromise', request, requestArgs);
  }

  /**
   * Execute an API request to any external system. This is a wrapper around the Web fetch method.
   *
   * ```ts
   * Formio.request('https://examples.form.io').then((form) => {
   *   console.log(form);
   * });
   * ```
   *
   * @param {string} url - The URL to request.
   * @param {string} method - The request method. GET, PUT, POST, DELETE, or PATCH
   * @param {object} data - The data to pass to the request (for PUT, POST, and PATCH methods)
   * @param {Headers} header - An object of headers to pass to the request.
   * @param {object} options - An object of options to pass to the request method.
   * @param {boolean} options.ignoreCache - To ignore internal caching of the request.
   * @param {object} options.headers - An object of headers to pass along to the request.
   * @param {boolean} options.noToken - If set to true, this will not include the Form.io x-jwt-token along with the request.
   * @param {string} options.namespace - The Form.io namespace to prepend to all LocalStorage variables such as formioToken.
   * @param {boolean} options.getHeaders - Set this if you wish to include the response headers with the return of this method.
   * @return {Promise<Response>|*}
   */
  static request(url: string, method?: any, data?: any, header?: any, opts?: any) {
    if (!url) {
      return Promise.reject('No url provided');
    }
    method = (method || 'GET').toUpperCase();

    // For reverse compatibility, if they provided the ignoreCache parameter,
    // then change it back to the options format where that is a parameter.
    if (isBoolean(opts)) {
      opts = { ignoreCache: opts };
    }
    if (!opts || !isObject(opts)) {
      opts = {};
    }

    // Generate a cachekey.
    const cacheKey: string = btoa(encodeURI(url));

    // Get the cached promise to save multiple loads.
    if (!opts.ignoreCache && method === 'GET' && Formio.cache.hasOwnProperty(cacheKey)) {
      return Promise.resolve(Formio.cloneResponse(Formio.cache[cacheKey]));
    }

    if (url[0] === '/') {
      url = Formio.baseUrl + url;
    }

    // Set up and fetch request
    const headers =
      header ||
      new Headers(
        opts.headers || {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      );
    const token = Formio.getToken(opts);
    if (token && !opts.noToken) {
      headers.set('x-jwt-token', token);
    }

    // The fetch-ponyfill can't handle a proper Headers class anymore. Change it back to an object.
    const headerObj: any = {};
    headers.forEach(function (value: any, name: string) {
      headerObj[name] = value;
    });

    let options: any = {
      method: method,
      headers: headerObj,
      mode: 'cors',
    };
    if (data) {
      options.body = JSON.stringify(data);
    }

    // Allow plugins to alter the options.
    options = Plugins.pluginAlter('requestOptions', options, url);
    if (options.namespace || Formio.namespace) {
      opts.namespace = options.namespace || Formio.namespace;
    }

    const requestToken = options.headers['x-jwt-token'];
    const result = Plugins.pluginAlter('wrapFetchRequestPromise', Formio.fetch(url, options), {
      url,
      method,
      data,
      opts,
    })
      .then((response: any) => {
        // Allow plugins to respond.
        response = Plugins.pluginAlter('requestResponse', response, Formio, data);

        if (!response.ok) {
          if (response.status === 440) {
            Formio.setToken(null, opts);
            Formio.events.emit('formio.sessionExpired', response.body || response);
          } else if (response.status === 401) {
            Formio.events.emit('formio.unauthorized', response.body || response);
          } else if (response.status === 416) {
            Formio.events.emit('formio.rangeIsNotSatisfiable', response.body || response);
          } else if (response.status === 504) {
            return Promise.reject(new Error('Network request failed'));
          }
          // Parse and return the error as a rejected promise to reject this promise
          return (
            response.headers.get('content-type').includes('application/json')
              ? response.json()
              : response.text()
          ).then((error: any) => {
            return Promise.reject(error);
          });
        }

        // Handle fetch results
        const respToken = response.headers.get('x-jwt-token');

        // In some strange cases, the fetch library will return an x-jwt-token without sending
        // one to the server. This has even been debugged on the server to verify that no token
        // was introduced with the request, but the response contains a token. This is an Invalid
        // case where we do not send an x-jwt-token and get one in return for any GET request.
        let tokenIntroduced = false;
        if (
          method === 'GET' &&
          !requestToken &&
          respToken &&
          !opts.external &&
          !url.includes('token=') &&
          !url.includes('x-jwt-token=')
        ) {
          console.warn('Token was introduced in request.');
          tokenIntroduced = true;
        }

        if (
          response.status >= 200 &&
          response.status < 300 &&
          respToken &&
          respToken !== '' &&
          !tokenIntroduced
        ) {
          Formio.setToken(respToken, {
            ...opts,
            ...{ fromCurrent: opts.fromCurrent || !!requestToken },
          });
        }
        // 204 is no content. Don't try to .json() it.
        if (response.status === 204) {
          return {};
        }

        const getResult = response.headers.get('content-type').includes('application/json')
          ? response.json()
          : response.text();
        return getResult.then((result: any) => {
          // Add some content-range metadata to the result here
          let range = response.headers.get('content-range');
          if (range && isObject(result)) {
            range = range.split('/');
            if (range[0] !== '*') {
              const skipLimit = range[0].split('-');
              (result as any).skip = Number(skipLimit[0]);
              (result as any).limit = skipLimit[1] - skipLimit[0] + 1;
            }
            (result as any).serverCount = range[1] === '*' ? range[1] : Number(range[1]);
          }

          if (!opts.getHeaders) {
            return result;
          }

          const headers: any = {};
          response.headers.forEach((item: any, key: any) => {
            headers[key] = item;
          });

          // Return the result with the headers.
          return {
            result,
            headers,
          };
        });
      })
      .then((result: any) => {
        if (opts.getHeaders) {
          return result;
        }

        // Cache the response.
        if (method === 'GET') {
          Formio.cache[cacheKey] = result;
        }

        return Formio.cloneResponse(result);
      })
      .catch((err: any) => {
        if (err === 'Bad Token' && opts.noToken !== false) {
          Formio.setToken(null, opts);
          Formio.events.emit('formio.badToken', err);
        }
        if (err.message) {
          err = new Error(`Could not connect to API server (${err.message}): ${url}`);
          err.networkError = true;
        }

        if (method === 'GET') {
          delete Formio.cache[cacheKey];
        }

        return Promise.reject(err);
      });

    return result;
  }

  // Needed to maintain reverse compatability...
  static get token() {
    return Formio.tokens.formioToken || '';
  }

  // Needed to maintain reverse compatability...
  static set token(token) {
    Formio.tokens.formioToken = token || '';
  }

  static useSessionToken(options: string | { namespace: string }) {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const namespace = options;
    if (typeof options === 'object') {
      options = options.namespace;
    }
    const tokenName = `${namespace || Formio.namespace || 'formio'}Token`;
    const token = localStorage.getItem(tokenName);

    if (token) {
      localStorage.removeItem(tokenName);
      sessionStorage.setItem(tokenName, token);
    }

    const userName = `${namespace || Formio.namespace || 'formio'}User`;
    const user = localStorage.getItem(userName);

    if (user) {
      localStorage.removeItem(userName);
      sessionStorage.setItem(userName, user);
    }

    localStorage.setItem('useSessionToken', 'true');
  }

  /**
   * Sets the JWT in storage to be used within an application.
   *
   * @param {string} token - The JWT token to set.
   * @param {object} options - Options as follows
   * @param {string} options.namespace - The namespace to save the token within. i.e. "formio"
   * @param {Formio} options.formio - The Formio instance.
   * @return {Promise<object>|void}
   */
  static setToken(token: any = '', opts: any = {}) {
    token = token || '';
    opts = typeof opts === 'string' ? { namespace: opts } : opts || {};
    const tokenName = `${opts.namespace || Formio.namespace || 'formio'}Token`;

    if (!Formio.tokens) {
      Formio.tokens = {};
    }

    const storage = localStorage.getItem('useSessionToken') ? sessionStorage : localStorage;

    if (!token) {
      if (!opts.fromUser) {
        opts.fromToken = true;
        Formio.setUser(null, opts);
      }
      // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
      try {
        storage.removeItem(tokenName);
      } catch (ignoreErr: any) {
        cookies.erase(tokenName, { path: '/' });
      }
      Formio.tokens[tokenName] = token;
      return Promise.resolve(null);
    }

    if (Formio.tokens[tokenName] !== token) {
      Formio.tokens[tokenName] = token;
      // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
      try {
        storage.setItem(tokenName, token);
      } catch (ignoreErr: any) {
        cookies.set(tokenName, token, { path: '/' });
      }
    }
    // Return or updates the current user
    return Formio.currentUser(opts.formio, opts);
  }

  /**
   * Returns the token set within the application for the user.
   *
   * @param {object} options - The options as follows.
   * @param {string} options.namespace - The namespace of the token you wish to fetch.
   * @param {boolean} options.decode - If you would like the token returned as decoded JSON.
   * @return {*}
   */
  static getToken(options?: any) {
    options = typeof options === 'string' ? { namespace: options } : options || {};
    const tokenName = `${options.namespace || Formio.namespace || 'formio'}Token`;
    const decodedTokenName = options.decode ? `${tokenName}Decoded` : tokenName;
    if (!Formio.tokens) {
      Formio.tokens = {};
    }

    if (Formio.tokens[decodedTokenName]) {
      return Formio.tokens[decodedTokenName];
    }
    try {
      const token = localStorage.getItem('useSessionToken')
        ? sessionStorage.getItem(tokenName)
        : localStorage.getItem(tokenName);
      Formio.tokens[tokenName] = token || '';
      if (options.decode) {
        Formio.tokens[decodedTokenName] = Formio.tokens[tokenName]
          ? jwtDecode(Formio.tokens[tokenName])
          : {};
        return Formio.tokens[decodedTokenName];
      }
      return Formio.tokens[tokenName];
    } catch (ignoreError: any) {
      Formio.tokens[tokenName] = cookies.get(tokenName);
      return '';
    }
  }

  /**
   * Sets the current user within the application cache.
   *
   * @param {object} user - JSON object of the user you wish to set.
   * @param {object} options - Options as follows
   * @param {string} options.namespace - The namespace of the tokens
   */
  static setUser(user: any, opts: any = {}) {
    const userName = `${opts.namespace || Formio.namespace || 'formio'}User`;
    const storage = localStorage.getItem('useSessionToken') ? sessionStorage : localStorage;
    if (!user) {
      if (!opts.fromToken) {
        opts.fromUser = true;
        Formio.setToken(null, opts);
      }

      // Emit an event on the cleared user.
      Formio.events.emit('formio.user', null);

      // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
      try {
        return storage.removeItem(userName);
      } catch (ignoreError: any) {
        return cookies.erase(userName, { path: '/' });
      }
    }
    // iOS in private browse mode will throw an error but we can't detect ahead of time that we are in private mode.
    try {
      storage.setItem(userName, JSON.stringify(user));
    } catch (ignoreError: any) {
      cookies.set(userName, JSON.stringify(user), { path: '/' });
    }

    // Emit an event on the authenticated user.
    Formio.events.emit('formio.user', user);
  }

  /**
   * Returns the user JSON.
   *
   * @param {object} options - Options as follows
   * @param {string} namespace - The namespace of the tokens stored within this application.
   * @return {object} - The user object.
   */
  static getUser(options?: any) {
    options = options || {};
    const userName = `${options.namespace || Formio.namespace || 'formio'}User`;
    try {
      return JSON.parse(
        (localStorage.getItem('useSessionToken') ? sessionStorage : localStorage).getItem(
          userName,
        ) || '',
      );
    } catch (ignoreError: any) {
      return JSON.parse(cookies.get(userName)!);
    }
  }

  /**
   * Sets the BaseURL for the application.
   *
   * @description Every application developed using the JavaScript SDK must set both the {@link Formio.setBaseUrl} and
   * {@link Formio.setProjectUrl} methods. These two functions ensure that every URL passed into the constructor of this
   * class can determine the "project" context for which the application is running.
   *
   * Any Open Source server applications will set both the {@link Formio.setBaseUrl} and {@link Formio.setProjectUrl}
   * values will be the same value.
   *
   * ```ts
   * Formio.setBaseUrl('https://yourwebsite.com/forms');
   * Formio.setProjectUrl('https://yourwebsite.com/forms/project');
   *
   * // Now the Formio constructor will know what is the "project" and what is the form alias name. Without setBaseUrl
   * // and setProjectUrl, this would throw an error.
   *
   * const formio = new Formio('https://yourwebsite.com/forms/project/user');
   * formio.loadForm().then((form) => {
   *   console.log(form);
   * });
   * ```
   *
   * @param {string} url - The URL of the Base API url.
   */
  static setBaseUrl(url: string) {
    Formio.baseUrl = url;
    if (!Formio.projectUrlSet) {
      Formio.projectUrl = url;
    }
  }

  /**
   * Returns the current base url described at {@link Formio.setBaseUrl}
   *
   * @return {string} - The base url of the application.
   */
  static getBaseUrl() {
    return Formio.baseUrl;
  }

  static setApiUrl(url: string) {
    return Formio.setBaseUrl(url);
  }

  static getApiUrl() {
    return Formio.getBaseUrl();
  }

  static setAppUrl(url: string) {
    console.warn('Formio.setAppUrl() is deprecated. Use Formio.setProjectUrl instead.');
    Formio.projectUrl = url;
    Formio.projectUrlSet = true;
  }

  /**
   * Sets the Project Url for the application. This is an important method that needs to be set for all applications. It
   * is documented @ {@link Formio.setBaseUrl}.
   *
   * @param {string} url - The project api url.
   */
  static setProjectUrl(url: string) {
    Formio.projectUrl = url;
    Formio.projectUrlSet = true;
  }

  /**
   * The Auth URL can be set to customize the authentication requests made from an application. By default, this is
   * just the same value as {@link Formio.projectUrl}
   *
   * @param {string} url - The authentication url
   */
  static setAuthUrl(url: string) {
    Formio.authUrl = url;
  }

  static getAppUrl() {
    console.warn('Formio.getAppUrl() is deprecated. Use Formio.getProjectUrl instead.');
    return Formio.projectUrl;
  }

  /**
   * Returns the Project url described at {@link Formio.setProjectUrl}
   *
   * @return {string|string} - The Project Url.
   */
  static getProjectUrl() {
    return Formio.projectUrl;
  }

  /**
   * Clears the runtime internal API cache.
   *
   * @description By default, the Formio class will cache all API requests in memory so that any subsequent requests
   * using GET method will return the cached results as long as the API URl is the same as what was cached previously.
   * This cache can be cleared using this method as follows.
   *
   * ```ts
   * Formio.clearCache();
   * ```
   *
   * Or, if you just wish to clear a single request, then the {@link Formio.request#options.ignoreCache} option can be
   * provided when making an API request as follows.
   *
   * ```ts
   * Formio.loadForm({}, {
   *   ignoreCache: true
   * }).then((form) => {
   *   console.log(form);
   * });
   * ```
   *
   * Both of the following will ensure that a new request is made to the API server and that the results will not be
   * from the cached result.
   */
  static clearCache() {
    Formio.cache = {};
  }

  /**
   * Return the access information about a Project, such as the Role ID's for that project, and if the server is
   * configured to do so, the Form and Resource access configurations that the authenticated user has access to.
   *
   * @description This is useful for an application to determine the UI for a specific user to identify which forms they have
   * access to submit or read.
   *
   * @param {Formio} formio - The Formio instance.
   * @return {Promise<Response>}
   */
  static accessInfo(formio?: any) {
    const projectUrl = formio ? formio.projectUrl : Formio.projectUrl;
    return Formio.makeRequest(formio, 'accessInfo', `${projectUrl}/access`);
  }

  /**
   * Returns an array of roles for the project, which includes the ID's and names of those roles.
   *
   * @param {Formio} formio - The Formio instance.
   * @return {Promise<Response>}
   */
  static projectRoles(formio?: any) {
    const projectUrl = formio ? formio.projectUrl : Formio.projectUrl;
    return Formio.makeRequest(formio, 'projectRoles', `${projectUrl}/role`);
  }

  /**
   * Return the currentUser object. This will fetch the user from the server and respond with the Submission JSON
   * of that user object.
   *
   * @param {Formio} formio - The Formio instance
   * @param {object} options - The options passed to {@link Formio.getUser}
   * @return {Promise<R>|*}
   */
  static currentUser(formio?: any, options: any = {}) {
    let authUrl = Formio.authUrl;
    if (!authUrl) {
      authUrl = formio ? formio.projectUrl : Formio.projectUrl || Formio.baseUrl;
    }
    authUrl += '/current';
    if (!options.ignoreCache || options.fromCurrent) {
      const user = Formio.getUser(options);
      if (user) {
        return Plugins.pluginAlter('wrapStaticRequestPromise', Promise.resolve(user), {
          url: authUrl,
          method: 'GET',
          options,
        });
      }
    }

    const token = Formio.getToken(options);
    if ((!options || !options.external) && !token) {
      return Plugins.pluginAlter('wrapStaticRequestPromise', Promise.resolve(null), {
        url: authUrl,
        method: 'GET',
        options,
      });
    }

    options.fromCurrent = true;
    return Formio.makeRequest(formio, 'currentUser', authUrl, 'GET', null, options).then(
      (response: any) => {
        Formio.setUser(response, options);
        return response;
      },
    );
  }

  /**
   * Performs a logout of the Form.io application. This will reset all cache, as well as make a request to the logout
   * endpoint of the Form.io api platform.
   *
   * @param {Formio} formio - A Formio instance.
   * @param {object} options - Options passed to both {@link Formio.setToken} as well as {@link Formio.setUser}
   * @return {Promise<Response>}
   */
  static logout(formio?: any, options: any = {}) {
    options.formio = formio;
    const projectUrl = Formio.authUrl
      ? Formio.authUrl
      : formio
        ? formio.projectUrl
        : Formio.baseUrl;
    const logout = () => {
      Formio.setToken(null, options);
      Formio.setUser(null, options);
      Formio.clearCache();
      localStorage.removeItem('useSessionToken');
    };
    return Formio.makeRequest(formio, 'logout', `${projectUrl}/logout`)
      .then(function (result: any) {
        logout();
        if (result.shouldRedirect && result.url) {
          window.location.href = result.url;
        }
        return result;
      })
      .catch(function (err: any) {
        logout();
        throw err;
      });
  }

  /**
   * Returns the query passed to a page in JSON object format.
   *
   * @description For example, lets say you visit your application using
   * the url as follows.
   *
   * ```
   *   https://yourapplication.com/?token=23423423423&username=Joe
   * ```
   *
   * The following code will provide your application with the following.
   *
   * ```ts
   * const query Formio.pageQuery();
   * console.log(query.token); // Will print 23423423423
   * console.log(query.username); // Will print Joe
   * ```
   *
   * @return {{}} - A JSON object representation of the query that was passed to the URL of an application.
   */
  static pageQuery() {
    const pageQuery: any = {};
    pageQuery.paths = [];
    const hashes = location.hash.substr(1).replace(/\?/g, '&').split('&');
    let parts = [];
    location.search
      .substr(1)
      .split('&')
      .forEach(function (item) {
        parts = item.split('=');
        if (parts.length > 1) {
          pageQuery[parts[0]] = parts[1] && decodeURIComponent(parts[1]);
        }
      });

    hashes.forEach(function (item) {
      parts = item.split('=');
      if (parts.length > 1) {
        pageQuery[parts[0]] = parts[1] && decodeURIComponent(parts[1]);
      } else if (item.indexOf('/') === 0) {
        pageQuery.paths = item.substr(1).split('/');
      }
    });
    return pageQuery;
  }

  /**
   * Much like {@link Formio.currentUser}, but instead automatically injects the Bearer tokens into the headers to
   * perform a Token swap of the OAuth token which will then return the JWT token for that user.
   *
   * @param {Formio} formio - The Formio instance
   * @param {string} token - An OAuth Bearer token to use for a token swap between the OAuth provider and Form.io
   * @return {Promise<R>|*}
   */
  static oAuthCurrentUser(formio: any, token: string) {
    return Formio.currentUser(formio, {
      external: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static oauthLogoutURI(uri: string, options: string | { namespace: string }): string {
    options = typeof options === 'string' ? { namespace: options } : options || {};
    const logoutURIName = `${options.namespace || Formio.namespace || 'formio'}LogoutAuthUrl`;
    localStorage.setItem(logoutURIName, uri);
    return Formio.tokens[logoutURIName];
  }

  /**
   * Perform a SAML initialization.
   *
   * @description Typically, you would use the {@link Formio.ssoInit} method to perform this function
   * since this method is an alias for the following.
   *
   * ```ts
   * Formio.samlInit();
   * Formio.ssoInit('saml');  // This is the exact same thing as calling Formio.samlInit
   * ```
   *
   * This method will return false if the process is just starting. The code below is a typical block of code that is
   * used to automatically trigger the SAML authentication process within your application using a Button component.
   *
   * ```ts
   * if (Formio.pageQuery().saml) {
   *   const sso = Formio.samlInit();
   *   if (sso) {
   *     sso.then((user) => {
   *       // The SSO user is now loaded!
   *       console.log(user);
   *     });
   *   }
   * }
   * ```
   *
   * You can then place the following code withiin the "Custom" action of a Button component on your form.
   *
   * ```ts
   * Formio.samlInit();
   * ```
   *
   * Now when you click on this button, it will start the handshake process with SAML, and once it returns, will pass
   * a "saml" query parameter back to your application which will execute the code to load the current user from SAML.
   *
   * @param {object} options - Options to pass to the SAML initialization process.
   * @param {string} options.relay - The URL that will be used as the authentication "relay" that occurs during a SAML handshake process.
   * @return {boolean|Promise<Object>|void}
   */
  static samlInit(options: any = {}) {
    const query = Formio.pageQuery();
    if (query.saml) {
      Formio.setUser(null);
      const retVal = Formio.setToken(query.saml);
      let uri = window.location.toString();
      uri = uri.substring(0, uri.indexOf('?'));
      if (window.location.hash) {
        uri += window.location.hash;
      }
      window.history.replaceState({}, document.title, uri);
      return retVal;
    }

    // Set the relay if not provided.
    if (!options.relay) {
      options.relay = window.location.href;
    }

    // go to the saml sso endpoint for this project.
    const authUrl = Formio.authUrl || Formio.projectUrl;
    window.location.href = `${authUrl}/saml/sso?relay=${encodeURI(options.relay)}`;
    return false;
  }

  /**
   * Perform an Okta Authentication process using the {@link https://developer.okta.com/code/javascript/okta_auth_sdk|Okta SDK}.
   *
   * @description This method does require that you first include the Okta JavaScript SDK within your application as follows.
   *
   * First you need to include the Okta Authentication script.
   *
   * ```html
   * <script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-auth-js/2.0.1/okta-auth-js.min.js" type="text/javascript"></script>
   * ```
   *
   * Then you can call this method as follows.
   *
   * ```ts
   * Formio.oktaInit();
   * ```
   *
   * @param {object} options - Options that are passed directly to the {@link https://github.com/okta/okta-auth-js#configuration-reference|Okta SDK constructor}
   * @param {constructor} options.OktaAuth - If the OktaAuth constructor is not provided global to the application, it can be provided to this method using this property.
   * @param {Formio} options.formio - The Formio instance.
   * @param {Array<string>} options.scopes - Scopes that are passed to the {@link https://github.com/okta/okta-auth-js#tokengetwithredirectoptions|getWithRedirect} method from the Okta SDK.
   * @return {Promise<Object>}
   */
  static oktaInit(options: any = {}) {
    if (typeof OktaAuth !== 'undefined') {
      options.OktaAuth = OktaAuth;
    }

    if (typeof options.OktaAuth === 'undefined') {
      const errorMessage =
        'Cannot find OktaAuth. Please include the Okta JavaScript SDK within your application. See https://developer.okta.com/code/javascript/okta_auth_sdk for an example.';
      console.warn(errorMessage);
      return Promise.reject(errorMessage);
    }
    return new Promise((resolve, reject) => {
      const Okta = options.OktaAuth;
      delete options.OktaAuth;
      const authClient = new Okta(options);
      authClient.tokenManager
        .get('accessToken')
        .then((accessToken: any) => {
          if (accessToken) {
            resolve(Formio.oAuthCurrentUser(options.formio, accessToken.accessToken));
          } else if (location.hash) {
            authClient.token
              .parseFromUrl()
              .then((token: any) => {
                authClient.tokenManager.add('accessToken', token);
                resolve(Formio.oAuthCurrentUser(options.formio, token.accessToken));
              })
              .catch((err: any) => {
                console.warn(err);
                reject(err);
              });
          } else {
            authClient.token.getWithRedirect({
              responseType: 'token',
              scopes: options.scopes,
            });
            resolve(false);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * A common static method to trigger any SSO processes. This method is really just an alias for other static methods.
   *
   * @param {('saml'|'okta')} type - The type of SSO to trigger. 'saml' is an alias for {@link Formio.samlInit}, and 'okta' is an alias for {@link Formio.oktaInit}.
   * @param {object} options - Options to pass to the specific sso methods
   * @return {*|Promise<Object>|boolean|void}
   */
  static ssoInit(type: string, options: any = {}) {
    switch (type) {
      case 'saml':
        return Formio.samlInit(options);
      case 'okta':
        return Formio.oktaInit(options);
      default:
        console.warn('Unknown SSO type');
        return Promise.reject('Unknown SSO type');
    }
  }

  /**
   * Lazy load a remote library dependency.
   *
   * @description This is useful for components that wish to lazy load a required library
   * by adding that library to the <scripts> section of the HTML webpage, and then provide a promise that will resolve
   * when the library becomes available for use.
   *
   * @example Load Google Maps API.
   * ```ts
   * Formio.requireLibrary('googleMaps', 'google.maps.Map', 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap', true).then(() => {
   *   // Once the promise resolves, the following can now be used within your application.
   *   const map = new google.maps.Map(document.getElementById("map"), {...});
   * });
   * ```
   *
   * @param {string} name - The internal name to give to the library you are loading. This is useful for caching the library for later use.
   * @param {string} property - The name of the global property that will be added to the global namespace once the library has been loaded. This is used to check to see if the property exists before resolving the promise that the library is ready for use.
   * @param {string} src - The URL of the library to lazy load.
   * @param {boolean} polling - Determines if polling should be used to determine if they library is ready to use. If set to false, then it will rely on a global callback called ${name}Callback where "name" is the first property passed to this method. When this is called, that will indicate when the library is ready. In most cases, you will want to pass true to this parameter to initiate a polling method to check for the library availability in the global context.
   * @param {HTMLElement} rootElement - The element after which the resource would be attached (useful when requiring resources from ShadowRoot).
   * @return {Promise<object>} - A promise that will resolve when the plugin is ready to be used.
   */
  static requireLibrary(
    name: string,
    property: string,
    src: string | Array<string>,
    polling: boolean = false,
    onload?: (ready: Promise<any>) => void,
    rootElement?: HTMLElement,
  ) {
    const resourceToDomOptions = {
      name,
      src,
      formio: Formio,
      onload,
      rootElement,
    };

    let hasResourceBeenAdded = false;

    if (!Formio.libraries.hasOwnProperty(name)) {
      Formio.libraries[name] = {};
      Formio.libraries[name].ready = new Promise((resolve, reject) => {
        Formio.libraries[name].resolve = resolve;
        Formio.libraries[name].reject = reject;
      });

      const callbackName: any = `${name}Callback`;

      if (!polling && !window[callbackName]) {
        (window as any)[callbackName] = () => Formio.libraries[name].resolve();
      }

      // See if the plugin already exists.
      const plugin = get(window, property);
      if (plugin) {
        Formio.libraries[name].resolve(plugin);
      } else {
        attachResourceToDom(resourceToDomOptions);
        hasResourceBeenAdded = true;

        // if no callback is provided, then check periodically for the script.
        if (polling) {
          const interval = setInterval(() => {
            const plugin = get(window, property);
            if (plugin) {
              clearInterval(interval);
              Formio.libraries[name].resolve(plugin);
            }
          }, 200);
        }
      }
    }

    const lib = Formio.libraries[name];

    if (rootElement && !hasResourceBeenAdded) {
      attachResourceToDom(resourceToDomOptions);
    }

    return onload && lib.loaded ? onload(lib.ready) : lib.ready;
  }

  /**
   * Determines if a lazy loaded library is ready to be used.
   *
   * @description Example: Let's assume that the example provided at {@link Formio.requireLibrary} was used elsewhere in your application.
   * You could now use the following within a separate place that will also resolve once the library is ready to be used.
   *
   * ```js
   * Formio.libraryReady('googleMaps').then(() => {
   *   // Once the promise resolves, the following can now be used within your application.
   *   const map = new google.maps.Map(document.getElementById("map"), {...});
   * });
   * ```
   *
   * @param {string} name - The name of the library to check.
   * @return {Promise<object>} - A promise that will resolve when the library is ready to be used.
   */
  static libraryReady(name: string) {
    if (Formio.libraries.hasOwnProperty(name) && Formio.libraries[name].ready) {
      return Formio.libraries[name].ready;
    }

    return Promise.reject(`${name} library was not required.`);
  }

  /**
   * Clones the response from the API so that it cannot be mutated.
   *
   * @param response
   */
  static cloneResponse(response: any) {
    const copy = fastCloneDeep(response);
    if (Array.isArray(response)) {
      copy.skip = (response as any).skip;
      copy.limit = (response as any).limit;
      copy.serverCount = (response as any).serverCount;
    }
    return copy;
  }

  /**
   * Sets the project path type.
   *
   * @param type
   */
  static setPathType(type: FormioPathType) {
    if (typeof type === 'string') {
      Formio.pathType = type;
    }
  }

  /**
   * Gets the project path type.
   */
  static getPathType() {
    return Formio.pathType;
  }

  // Add Plugin methods.
  public static plugins = Plugins.plugins;
  public static deregisterPlugin = Plugins.deregisterPlugin;
  public static registerPlugin = Plugins.registerPlugin;
  public static getPlugin = Plugins.getPlugin;
  public static pluginWait = Plugins.pluginWait;
  public static pluginGet = Plugins.pluginGet;
  public static pluginAlter = Plugins.pluginAlter;
}

// Adds Formio to the Plugins Interface.
Plugins.Formio = Formio;
