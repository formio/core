[@formio/core](../README.md) / [Modules](../modules.md) / [Formio](../modules/formio.md) / Formio

# Class: Formio

[Formio](../modules/formio.md).Formio

The Formio interface class. This is a minimalistic API library that allows you to work with the Form.io API's within JavaScript.

For more information about uses for this class, see the {@tutorial api} documentation.

```ts
const formio = new Formio('https://examples.form.io/example');
formio.loadForm().then((form) => {
  console.log(form);
});
```

## Table of contents

### Constructors

- [constructor](formio.formio-1.md#constructor)

### Properties

- [actionId](formio.formio-1.md#actionid)
- [actionUrl](formio.formio-1.md#actionurl)
- [actionsUrl](formio.formio-1.md#actionsurl)
- [base](formio.formio-1.md#base)
- [formId](formio.formio-1.md#formid)
- [formUrl](formio.formio-1.md#formurl)
- [formsUrl](formio.formio-1.md#formsurl)
- [noProject](formio.formio-1.md#noproject)
- [options](formio.formio-1.md#options)
- [path](formio.formio-1.md#path)
- [pathType](formio.formio-1.md#pathtype)
- [projectId](formio.formio-1.md#projectid)
- [projectUrl](formio.formio-1.md#projecturl)
- [projectsUrl](formio.formio-1.md#projectsurl)
- [query](formio.formio-1.md#query)
- [roleId](formio.formio-1.md#roleid)
- [roleUrl](formio.formio-1.md#roleurl)
- [rolesUrl](formio.formio-1.md#rolesurl)
- [submissionId](formio.formio-1.md#submissionid)
- [submissionUrl](formio.formio-1.md#submissionurl)
- [submissionsUrl](formio.formio-1.md#submissionsurl)
- [vId](formio.formio-1.md#vid)
- [vUrl](formio.formio-1.md#vurl)
- [vsUrl](formio.formio-1.md#vsurl)
- [Headers](formio.formio-1.md#headers)
- [authUrl](formio.formio-1.md#authurl)
- [baseUrl](formio.formio-1.md#baseurl)
- [cache](formio.formio-1.md#cache)
- [events](formio.formio-1.md#events)
- [fetch](formio.formio-1.md#fetch)
- [libraries](formio.formio-1.md#libraries)
- [namespace](formio.formio-1.md#namespace)
- [pathType](formio.formio-1.md#pathtype)
- [plugins](formio.formio-1.md#plugins)
- [projectUrl](formio.formio-1.md#projecturl)
- [projectUrlSet](formio.formio-1.md#projecturlset)
- [tokens](formio.formio-1.md#tokens)
- [version](formio.formio-1.md#version)

### Accessors

- [token](formio.formio-1.md#token)

### Methods

- [accessInfo](formio.formio-1.md#accessinfo)
- [actionInfo](formio.formio-1.md#actioninfo)
- [availableActions](formio.formio-1.md#availableactions)
- [canSubmit](formio.formio-1.md#cansubmit)
- [currentUser](formio.formio-1.md#currentuser)
- [delete](formio.formio-1.md#delete)
- [deleteAction](formio.formio-1.md#deleteaction)
- [deleteFile](formio.formio-1.md#deletefile)
- [deleteForm](formio.formio-1.md#deleteform)
- [deleteProject](formio.formio-1.md#deleteproject)
- [deleteRole](formio.formio-1.md#deleterole)
- [deleteSubmission](formio.formio-1.md#deletesubmission)
- [downloadFile](formio.formio-1.md#downloadfile)
- [getDownloadUrl](formio.formio-1.md#getdownloadurl)
- [getFormId](formio.formio-1.md#getformid)
- [getProjectId](formio.formio-1.md#getprojectid)
- [getTempToken](formio.formio-1.md#gettemptoken)
- [getToken](formio.formio-1.md#gettoken)
- [getUrlParts](formio.formio-1.md#geturlparts)
- [index](formio.formio-1.md#index)
- [isObjectId](formio.formio-1.md#isobjectid)
- [load](formio.formio-1.md#load)
- [loadAction](formio.formio-1.md#loadaction)
- [loadActions](formio.formio-1.md#loadactions)
- [loadForm](formio.formio-1.md#loadform)
- [loadForms](formio.formio-1.md#loadforms)
- [loadProject](formio.formio-1.md#loadproject)
- [loadRole](formio.formio-1.md#loadrole)
- [loadRoles](formio.formio-1.md#loadroles)
- [loadSubmission](formio.formio-1.md#loadsubmission)
- [loadSubmissions](formio.formio-1.md#loadsubmissions)
- [makeRequest](formio.formio-1.md#makerequest)
- [save](formio.formio-1.md#save)
- [saveAction](formio.formio-1.md#saveaction)
- [saveForm](formio.formio-1.md#saveform)
- [saveProject](formio.formio-1.md#saveproject)
- [saveRole](formio.formio-1.md#saverole)
- [saveSubmission](formio.formio-1.md#savesubmission)
- [setToken](formio.formio-1.md#settoken)
- [uploadFile](formio.formio-1.md#uploadfile)
- [userPermissions](formio.formio-1.md#userpermissions)
- [accessInfo](formio.formio-1.md#accessinfo)
- [clearCache](formio.formio-1.md#clearcache)
- [currentUser](formio.formio-1.md#currentuser)
- [deregisterPlugin](formio.formio-1.md#deregisterplugin)
- [getApiUrl](formio.formio-1.md#getapiurl)
- [getAppUrl](formio.formio-1.md#getappurl)
- [getBaseUrl](formio.formio-1.md#getbaseurl)
- [getPathType](formio.formio-1.md#getpathtype)
- [getPlugin](formio.formio-1.md#getplugin)
- [getProjectUrl](formio.formio-1.md#getprojecturl)
- [getRequestArgs](formio.formio-1.md#getrequestargs)
- [getToken](formio.formio-1.md#gettoken)
- [getUrlParts](formio.formio-1.md#geturlparts)
- [getUser](formio.formio-1.md#getuser)
- [identity](formio.formio-1.md#identity)
- [libraryReady](formio.formio-1.md#libraryready)
- [loadProjects](formio.formio-1.md#loadprojects)
- [logout](formio.formio-1.md#logout)
- [makeRequest](formio.formio-1.md#makerequest)
- [makeStaticRequest](formio.formio-1.md#makestaticrequest)
- [noop](formio.formio-1.md#noop)
- [oAuthCurrentUser](formio.formio-1.md#oauthcurrentuser)
- [oktaInit](formio.formio-1.md#oktainit)
- [pageQuery](formio.formio-1.md#pagequery)
- [pluginAlter](formio.formio-1.md#pluginalter)
- [pluginGet](formio.formio-1.md#pluginget)
- [pluginWait](formio.formio-1.md#pluginwait)
- [projectRoles](formio.formio-1.md#projectroles)
- [registerPlugin](formio.formio-1.md#registerplugin)
- [request](formio.formio-1.md#request)
- [requireLibrary](formio.formio-1.md#requirelibrary)
- [samlInit](formio.formio-1.md#samlinit)
- [serialize](formio.formio-1.md#serialize)
- [setApiUrl](formio.formio-1.md#setapiurl)
- [setAppUrl](formio.formio-1.md#setappurl)
- [setAuthUrl](formio.formio-1.md#setauthurl)
- [setBaseUrl](formio.formio-1.md#setbaseurl)
- [setPathType](formio.formio-1.md#setpathtype)
- [setProjectUrl](formio.formio-1.md#setprojecturl)
- [setToken](formio.formio-1.md#settoken)
- [setUser](formio.formio-1.md#setuser)
- [ssoInit](formio.formio-1.md#ssoinit)

## Constructors

### constructor

\+ **new Formio**(`path?`: *string*, `options?`: *any*): [*Formio*](formio.formio-1.md)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`path?` | *string* | A project, form, and submission API Url.   |
`options` | *any* | Available options to configure the Javascript API.   |

**Returns:** [*Formio*](formio.formio-1.md)

Defined in: Formio.ts:67

## Properties

### actionId

• **actionId**: *string*= ''

Defined in: Formio.ts:60

___

### actionUrl

• **actionUrl**: *string*= ''

Defined in: Formio.ts:61

___

### actionsUrl

• **actionsUrl**: *string*= ''

Defined in: Formio.ts:59

___

### base

• **base**: *string*= ''

Defined in: Formio.ts:46

___

### formId

• **formId**: *string*= ''

Defined in: Formio.ts:55

___

### formUrl

• **formUrl**: *string*= ''

Defined in: Formio.ts:53

___

### formsUrl

• **formsUrl**: *string*= ''

Defined in: Formio.ts:54

___

### noProject

• **noProject**: *boolean*= false

Defined in: Formio.ts:67

___

### options

• **options**: *any*

___

### path

• `Optional` **path**: *undefined* \| *string*

___

### pathType

• **pathType**: *string*= ''

Defined in: Formio.ts:66

___

### projectId

• **projectId**: *string*= ''

Defined in: Formio.ts:49

___

### projectUrl

• **projectUrl**: *string*= ''

Defined in: Formio.ts:48

___

### projectsUrl

• **projectsUrl**: *string*= ''

Defined in: Formio.ts:47

___

### query

• **query**: *string*= ''

Defined in: Formio.ts:65

___

### roleId

• **roleId**: *string*= ''

Defined in: Formio.ts:52

___

### roleUrl

• **roleUrl**: *string*= ''

Defined in: Formio.ts:50

___

### rolesUrl

• **rolesUrl**: *string*= ''

Defined in: Formio.ts:51

___

### submissionId

• **submissionId**: *string*= ''

Defined in: Formio.ts:58

___

### submissionUrl

• **submissionUrl**: *string*= ''

Defined in: Formio.ts:57

___

### submissionsUrl

• **submissionsUrl**: *string*= ''

Defined in: Formio.ts:56

___

### vId

• **vId**: *string*= ''

Defined in: Formio.ts:63

___

### vUrl

• **vUrl**: *string*= ''

Defined in: Formio.ts:64

___

### vsUrl

• **vsUrl**: *string*= ''

Defined in: Formio.ts:62

___

### Headers

▪ `Static` **Headers**: *any*

Defined in: Formio.ts:42

___

### authUrl

▪ `Static` **authUrl**: *string*= ''

Defined in: Formio.ts:33

___

### baseUrl

▪ `Static` **baseUrl**: *string*= 'https://api.form.io'

Defined in: Formio.ts:31

___

### cache

▪ `Static` **cache**: *any*

Defined in: Formio.ts:36

___

### events

▪ `Static` **events**: *EventEmitter*<string \| symbol, any\>

Defined in: Formio.ts:38

___

### fetch

▪ `Static` **fetch**: *any*

Defined in: Formio.ts:41

___

### libraries

▪ `Static` **libraries**: *any*

Defined in: Formio.ts:39

___

### namespace

▪ `Static` **namespace**: *string*= ''

Defined in: Formio.ts:37

___

### pathType

▪ `Static` **pathType**: *string*= ''

Defined in: Formio.ts:34

___

### plugins

▪ `Static` **plugins**: *any*[]

Defined in: Formio.ts:40

___

### projectUrl

▪ `Static` **projectUrl**: *string*= ''

Defined in: Formio.ts:32

___

### projectUrlSet

▪ `Static` **projectUrlSet**: *boolean*= false

Defined in: Formio.ts:35

___

### tokens

▪ `Static` **tokens**: *any*

Defined in: Formio.ts:43

___

### version

▪ `Static` **version**: *string*= '---VERSION---'

Defined in: Formio.ts:44

## Accessors

### token

• `Static`get **token**(): *any*

**Returns:** *any*

Defined in: Formio.ts:1596

• `Static`set **token**(`token`: *any*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`token` | *any* |

**Returns:** *void*

Defined in: Formio.ts:1601

## Methods

### accessInfo

▸ **accessInfo**(): *any*

Instance method for [Formio.accessInfo](formio.formio-1.md#accessinfo)

**Returns:** *any*

Defined in: Formio.ts:939

___

### actionInfo

▸ **actionInfo**(`name`: *string*): *any*

Returns the action information for a specific action, such as "save".

```ts
const formio = new Formio('https://examples.form.io/example/actions/save');
formio.actionInfo().then((info) => {
  console.log(info);
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`name` | *string* | The name of the action you would like to get information for. i.e. "save", "webhook", etc.   |

**Returns:** *any*

Defined in: Formio.ts:857

___

### availableActions

▸ **availableActions**(): *any*

Returns a list of available actions

**Returns:** *any*

Defined in: Formio.ts:840

___

### canSubmit

▸ **canSubmit**(): *Promise*<any\>

`Determine if the current user can submit a form.

**Returns:** *Promise*<any\>

Defined in: Formio.ts:1265

___

### currentUser

▸ **currentUser**(`options?`: *any*): *any*

Instance method for [Formio.currentUser](formio.formio-1.md#currentuser)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`options?` | *any* | Options to pass to [Formio.request](formio.formio-1.md#request)   |

**Returns:** *any*

Defined in: Formio.ts:930

___

### delete

▸ **delete**(`type`: *string*, `opts?`: *any*): *any*

Deletes a remote resource of any provided type.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`type` | *string* | The type of resource to delete. "submission", "form", etc.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:256

___

### deleteAction

▸ **deleteAction**(`opts?`: *any*): *any*

Delete an action

```ts
const formio = new Formio('https://examples.form.io/example/action/234234234234');
formio.deleteAction().then(() => {
  console.log('Action was deleted.');
});
```

#### Parameters:

Name | Type |
:------ | :------ |
`opts?` | *any* |

**Returns:** *any*

Defined in: Formio.ts:813

___

### deleteFile

▸ **deleteFile**(`file`: *any*, `options`: *any*): *any*

Deletes a file from the provider.

#### Parameters:

Name | Type |
:------ | :------ |
`file` | *any* |
`options` | *any* |

**Returns:** *any*

Defined in: Formio.ts:1132

___

### deleteForm

▸ **deleteForm**(`opts?`: *any*): *any*

Deletes a form.

```ts
const formio = new Formio('https://examples.form.io/example');
formio.deleteForm().then(() => {
  console.log('Deleted!');
});
```

#### Parameters:

Name | Type |
:------ | :------ |
`opts?` | *any* |

**Returns:** *any*

Defined in: Formio.ts:620

___

### deleteProject

▸ **deleteProject**(`opts?`: *any*): *any*

Deletes a project

```ts
const formio = new Formio('https://examples.form.io');
formio.deleteProject();
```

#### Parameters:

Name | Type |
:------ | :------ |
`opts?` | *any* |

**Returns:** *any*

Defined in: Formio.ts:412

___

### deleteRole

▸ **deleteRole**(`opts?`: *any*): *any*

Deletes a role within a project.

#### Parameters:

Name | Type |
:------ | :------ |
`opts?` | *any* |

**Returns:** *any*

Defined in: Formio.ts:493

___

### deleteSubmission

▸ **deleteSubmission**(`opts?`: *any*): *any*

Deletes a submission.

#### Parameters:

Name | Type |
:------ | :------ |
`opts?` | *any* |

**Returns:** *any*

Defined in: Formio.ts:710

___

### downloadFile

▸ **downloadFile**(`file`: *any*, `options`: *any*): *any*

Download a file.

#### Parameters:

Name | Type |
:------ | :------ |
`file` | *any* |
`options` | *any* |

**Returns:** *any*

Defined in: Formio.ts:1099

___

### getDownloadUrl

▸ **getDownloadUrl**(`form`: *any*): *any*

Get a PDF download url for a submission, which will generate a new PDF of the submission. This method will first
fetch a temporary download token, and then append this to the download url for this form.

```ts
const formio = new Formio('https://examples.form.io/example/submission/324234234234234');
formio.getDownloadUrl().then((url) => {
  console.log(url);
});
```

#### Parameters:

Name | Type |
:------ | :------ |
`form` | *any* |

**Returns:** *any*

- The download url.

Defined in: Formio.ts:1002

___

### getFormId

▸ **getFormId**(): *any*

Get the ID of a form.

```ts
const formio = new Formio('https://examples.form.io/example');
formio.getFormId().then((formId) => {
  console.log(formId);
});
```

**Returns:** *any*

Defined in: Formio.ts:910

___

### getProjectId

▸ **getProjectId**(): *any*

Get the project ID of project.

```ts
const formio = new Formio('https://examples.form.io');
formio.getProjectId().then((projectId) => {
  console.log(projectId);
};
```

**Returns:** *any*

Defined in: Formio.ts:884

___

### getTempToken

▸ **getTempToken**(`expire`: *any*, `allowed`: *string*, `options?`: *any*): *any*

Returns a temporary authentication token for single purpose token generation.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`expire` | *any* | The amount of seconds to wait before this temp token expires.   |
`allowed` | *string* | The allowed path string inn the format GET:/path   |
`options?` | *any* | The options passed to {@link Formio#getToken}    |

**Returns:** *any*

Defined in: Formio.ts:973

___

### getToken

▸ **getToken**(`options?`: *any*): *any*

Returns the JWT token for this instance.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`options?` | *any* | The following options are provided.   |

**Returns:** *any*

- The JWT token for this user.

Defined in: Formio.ts:950

___

### getUrlParts

▸ **getUrlParts**(`url`: *string*): *null* \| *RegExpMatchArray*

#### Parameters:

Name | Type |
:------ | :------ |
`url` | *string* |

**Returns:** *null* \| *RegExpMatchArray*

Defined in: Formio.ts:1283

___

### index

▸ **index**(`type`: *string*, `query?`: *any*, `opts?`: *any*): *any*

Returns the index (array of records) for any provided type.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`type` | *string* | The type of resource to fetch the index of. "submission", "form", etc.   |
`query?` | *any* | A query object to pass to the request.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:275

___

### isObjectId

▸ **isObjectId**(`id`: *string*): *boolean*

Determine if a string ID is a valid MongoID.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | *string* | The id that should be tested if it is avalid id.   |

**Returns:** *boolean*

- true if it is a valid MongoId, false otherwise.

Defined in: Formio.ts:867

___

### load

▸ **load**(`type`: *string*, `query?`: *any*, `opts?`: *any*): *any*

**`summary`** Load (GET) a document record.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`type` | *string* | The type of resource to fetch the index of. "submission", "form", etc.   |
`query?` | *any* | A query object to pass to the request.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:314

___

### loadAction

▸ **loadAction**(`query?`: *any*, `opts?`: *any*): *any*

Loads a form action.

```ts
const formio = new Formio('https://examples.form.io/example/action/234234234234');
formio.loadAction().then((action) => {
  console.log(action);
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`query?` | *any* | Query parameters similar to {@link Formio#load}.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:752

___

### loadActions

▸ **loadActions**(`query?`: *any*, `opts?`: *any*): *any*

Loads all actions within a form.

```ts
const formio = new Formio('https://examples.form.io/example');
formio.loadActions().then((actions) => {
  console.log(actions);
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`query?` | *any* | Query parameters similar to {@link Formio#load}.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:831

___

### loadForm

▸ **loadForm**(`query?`: *any*, `opts?`: *any*): *any*

Loads a form.

```ts
const formio = new Formio('https://examples.form.io/example');
formio.loadForm().then((form) => {
  console.log(form);
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`query?` | *any* | Query parameters similar to {@link Formio#load}.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:528

___

### loadForms

▸ **loadForms**(`query?`: *any*, `opts?`: *any*): *any*

Loads all forms within a project.

```ts
const formio = new Formio('https://examples.form.io');
formio.loadForms().then((forms) => {
  console.log(forms);
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`query?` | *any* | Query parameters similar to {@link Formio#load}.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:638

___

### loadProject

▸ **loadProject**(`query?`: *any*, `opts?`: *any*): *any*

**`summary`** Loads a project.

```ts
const formio = new Formio('https://examples.form.io');
formio.loadProject().then((project) => {
  console.log(project);
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`query?` | *any* | Query parameters to pass to {@link Formio#load}.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:365

___

### loadRole

▸ **loadRole**(`opts?`: *any*): *any*

Loads a role within a project.

```ts
const formio = new Formio('https://examples.form.io/role/234234234234');
formio.loadRole().then((role) => {
  console.log(role);
});
```

#### Parameters:

Name | Type |
:------ | :------ |
`opts?` | *any* |

**Returns:** *any*

Defined in: Formio.ts:450

___

### loadRoles

▸ **loadRoles**(`opts?`: *any*): *any*

Load all roles within a project.

```ts
const formio = new Formio('https://examples.form.io');
formio.loadRoles().then((roles) => {
  console.log(roles);
});
```

#### Parameters:

Name | Type |
:------ | :------ |
`opts?` | *any* |

**Returns:** *any*

Defined in: Formio.ts:510

___

### loadSubmission

▸ **loadSubmission**(`query?`: *any*, `opts?`: *any*): *any*

Loads a specific submissionn.

```ts
const formio = new Formio('https://examples.form.io/example/submission/23423423423423423');
formio.loadSubmission().then((submission) => {
  console.log(submission);
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`query?` | *any* | Query parameters similar to {@link Formio#load}.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:656

___

### loadSubmissions

▸ **loadSubmissions**(`query?`: *any*, `opts?`: *any*): *any*

Loads all submissions within a form.

```ts
const formio = new Formio('https://examples.form.io/example');
formio.loadSubmissions({
  params: {
    limit: 25,
    'data.lastName__regex': 'smith'
  }
}).then((submissions) => {
  // Should print out 25 submissions where the last name contains "smith".
  console.log(submissions);
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`query?` | *any* | Query parameters similar to {@link Formio#load}.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:734

___

### makeRequest

▸ **makeRequest**(`type`: *string*, `url`: *string*, `method?`: *string*, `data?`: *any*, `opts?`: *any*): *any*

**`summary`** Call [Formio.makeRequest](formio.formio-1.md#makerequest) for this Formio instance.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`type` | *string* | The request resource type. "submission", "form", etc.   |
`url` | *string* | The URL to request.   |
`method?` | *string* | The request method. GET, PUT, POST, DELETE, or PATCH   |
`data?` | *any* | The data to pass to the request (for PUT, POST, and PATCH methods)   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:347

___

### save

▸ **save**(`type`: *string*, `data?`: *any*, `opts?`: *any*): *any*

Save a document record using "upsert". If the document does not exist, it will be created, if the _id is provided,
it will be updated.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`type` | *string* | The type of resource to fetch the index of. "submission", "form", etc.   |
`data?` | *any* | The resource data object.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:293

___

### saveAction

▸ **saveAction**(`data?`: *any*, `opts?`: *any*): *any*

Create a new or update an existing action.

### Create a new action for a form.
```ts
const formio = new Formio('https://examples.form.io/example');
formio.saveAction({
  data: {
    name: 'webhook',
    title: 'Webhook Action',
    method: ['create', 'update', 'delete'],
    handler: ['after'],
    condition: {},
    settings: {
      url: 'https://example.com',
      headers: [{}],
      block: false,
      forwardHeaders: false
    }
  }
}).then((action) => {
  console.log(action);
});
```

### Update an action
```ts
const formio = new Formio('https://examples.form.io/example/action/234234234234');
formio.loadAction().then((action) => {
  action.title = 'Updated title';
  formio.saveAction(action).then(() => {
    console.log('Done!');
  });
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`data?` | *any* | The action JSON   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:796

___

### saveForm

▸ **saveForm**(`data?`: *any*, `opts?`: *any*): *any*

Create or Update a specific form.

### Create form example
```ts
const formio = new Formio('https://examples.form.io');
formio.saveForm({
  title: 'Employee',
  type: 'resource',
  path: 'employee',
  name: 'employee',
  components: [
    {
      type: 'textfield',
      key: 'firstName',
      label: 'First Name'
    },
    {
      type: 'textfield',
      key: 'lastName',
      label: 'Last Name'
    }
  ]
});
```

### Update a form example
```ts
const formio = new Formio('https://examples.form.io/example');
formio.loadForm().then((form) => {
  form.title = 'Changed Title';
  formio.saveForm(form).then(() => {
    console.log('DONE!!!');
  });
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`data?` | *any* | The Form JSON to create or update.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:603

___

### saveProject

▸ **saveProject**(`data?`: *any*, `opts?`: *any*): *any*

Saves or Updates a project.

### Create a new project
```ts
const formio = new Formio();
formio.saveProject({
  title: 'My Project',
  path: 'myproject',
  name: 'myproject'
});
```

### Update an existing project
```ts
const formio = new Formio('https://examples.form.io');
formio.loadProject().then((project) => {
  project.title = 'Title changed';
  formio.saveProject(project).then(() => {
    console.log('Done saving project!');
  });
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`data?` | *any* | The project JSON to create or update.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:397

___

### saveRole

▸ **saveRole**(`data?`: *any*, `opts?`: *any*): *any*

Create a new or Update an existing role within a project.

### Create new Role example
```ts
const formio = new Formio('https://examples.form.io');
formio.saveRole({
  title: 'Employee',
  description: 'A person who belongs to a company.'
}).then((role) => {
  console.log(role);
});
```

### Update existing role example
```ts
const formio = new Formio('https://examples.form.io/role/234234234234234');
formio.loadRole().then((role) => {
  role.title = 'Manager';
  formio.saveRole(role).then(() => {
    console.log('DONE');
  });
});
```

#### Parameters:

Name | Type |
:------ | :------ |
`data?` | *any* |
`opts?` | *any* |

**Returns:** *any*

Defined in: Formio.ts:483

___

### saveSubmission

▸ **saveSubmission**(`data?`: *any*, `opts?`: *any*): *any*

Creates a new or Updates an existing submission.

### Create a new submission
```ts
const formio = new Formio('https://examples.form.io/example');
formio.saveSubmission({
  data: {
    firstName: 'Joe',
    lastName: 'Smith'
  }
}).then((submission) => {
  // This will now be the complete submission object saved on the server.
  console.log(submission);
});
```

### Update an existing submission
```ts
const formio = new Formio('https://examples.form.io/example/submission/23423423423423423');
formio.loadSubmission().then((submission) => {
  submission.data.lastName = 'Thompson';
  formio.saveSubmission(submission).then(() => {
    console.log('DONE');
  });
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`data?` | *any* | The submission JSON object.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:697

___

### setToken

▸ **setToken**(`token`: *any*, `options?`: *any*): *any*

Sets the JWT token for this instance.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`token` | *any* | The JWT token to set.   |
`options?` | *any* | The following options are provided.   |

**Returns:** *any*

- The JWT token that was set.

Defined in: Formio.ts:962

___

### uploadFile

▸ **uploadFile**(`storage`: *any*, `file`: *any*, `fileName`: *any*, `dir`: *any*, `progressCallback`: *any*, `url`: *any*, `options`: *any*, `fileKey`: *any*, `groupPermissions`: *any*, `groupId`: *any*, `uploadStartCallback`: *any*, `abortCallback`: *any*): *any*

Upload a file to the Form.io platform.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`storage` | *any* | The storage type for this file. i.e. "url", "s3", "dropbox", etc.   |
`file` | *any* | The file object to upload.   |
`fileName` | *any* | The filename to give to the file once it is uploaded.   |
`dir` | *any* | The directory name to place the file.   |
`progressCallback` | *any* | Called when the progress of the file updates.   |
`url` | *any* | Used for IndexDB uploads (offline file uploads) to provide the url of the upload destination.   |
`options` | *any* | Options used to pass to each upload provider for upload configurations.   |
`fileKey` | *any* | Custom file key to pass to custom upload providers.   |
`groupPermissions` | *any* | - |
`groupId` | *any* | - |
`uploadStartCallback` | *any* | - |
`abortCallback` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:1046

___

### userPermissions

▸ **userPermissions**(`user?`: *any*, `form?`: *any*, `submission?`: *any*): *Promise*<any\>

Returns the user permissions to a form and submission.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`user?` | *any* | The user or current user if undefined. For anonymous, use "null"   |
`form?` | *any* | The form or current form if undefined. For no form check, use "null"   |
`submission?` | *any* | The submisison or "index" if undefined.    |

**Returns:** *Promise*<any\>

Defined in: Formio.ts:1168

___

### accessInfo

▸ `Static`**accessInfo**(`formio?`: *any*): *any*

Return the access information about a Project, such as the Role ID's for that project, and if the server is
configured to do so, the Form and Resource access configurations that the authenticated user has access to.

**`description`** This is useful for an application to determine the UI for a specific user to identify which forms they have
access to submit or read.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`formio?` | *any* | The Formio instance.   |

**Returns:** *any*

Defined in: Formio.ts:1934

___

### clearCache

▸ `Static`**clearCache**(): *void*

Clears the runtime internal API cache.

**`description`** By default, the Formio class will cache all API requests in memory so that any subsequent requests
using GET method will return the cached results as long as the API URl is the same as what was cached previously.
This cache can be cleared using this method as follows.

```ts
Formio.clearCache();
```

Or, if you just wish to clear a single request, then the {@link Formio.request#options.ignoreCache} option can be
provided when making an API request as follows.

```ts
Formio.loadForm({}, {
  ignoreCache: true
}).then((form) => {
  console.log(form);
});
```

Both of the following will ensure that a new request is made to the API server and that the results will not be
from the cached result.

**Returns:** *void*

Defined in: Formio.ts:1855

___

### currentUser

▸ `Static`**currentUser**(`formio?`: *any*, `options?`: *any*): *any*

Return the currentUser object. This will fetch the user from the server and respond with the Submission JSON
of that user object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`formio?` | *any* | The Formio instance   |
`options` | *any* | The options passed to [Formio.getUser](formio.formio-1.md#getuser)   |

**Returns:** *any*

Defined in: Formio.ts:1958

___

### deregisterPlugin

▸ `Static`**deregisterPlugin**(`plugin`: *any*): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`plugin` | *any* |

**Returns:** *boolean*

Defined in: Formio.ts:1864

___

### getApiUrl

▸ `Static`**getApiUrl**(): *string*

**Returns:** *string*

Defined in: Formio.ts:1785

___

### getAppUrl

▸ `Static`**getAppUrl**(): *string*

**Returns:** *string*

Defined in: Formio.ts:1816

___

### getBaseUrl

▸ `Static`**getBaseUrl**(): *string*

Returns the current base url described at [Formio.setBaseUrl](formio.formio-1.md#setbaseurl)

**Returns:** *string*

- The base url of the application.

Defined in: Formio.ts:1777

___

### getPathType

▸ `Static`**getPathType**(): *string*

**Returns:** *string*

Defined in: Formio.ts:2356

___

### getPlugin

▸ `Static`**getPlugin**(`name`: *string*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`name` | *string* |

**Returns:** *any*

Defined in: Formio.ts:1884

___

### getProjectUrl

▸ `Static`**getProjectUrl**(): *string*

Returns the Project url described at [Formio.setProjectUrl](formio.formio-1.md#setprojecturl)

**Returns:** *string*

- The Project Url.

Defined in: Formio.ts:1826

___

### getRequestArgs

▸ `Static`**getRequestArgs**(`formio`: *any*, `type`: *string*, `url`: *string*, `method?`: *any*, `data?`: *any*, `opts?`: *any*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`formio` | *any* |
`type` | *string* |
`url` | *string* |
`method?` | *any* |
`data?` | *any* |
`opts?` | *any* |

**Returns:** *any*

Defined in: Formio.ts:1313

___

### getToken

▸ `Static`**getToken**(`options?`: *any*): *any*

Returns the token set within the application for the user.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`options?` | *any* | The options as follows.   |

**Returns:** *any*

Defined in: Formio.ts:1661

___

### getUrlParts

▸ `Static`**getUrlParts**(`url`: *string*, `formio`: *any*): *null* \| *RegExpMatchArray*

#### Parameters:

Name | Type |
:------ | :------ |
`url` | *string* |
`formio` | *any* |

**Returns:** *null* \| *RegExpMatchArray*

Defined in: Formio.ts:1287

___

### getUser

▸ `Static`**getUser**(`options?`: *any*): *any*

Returns the user JSON.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`options?` | *any* | Options as follows   |

**Returns:** *any*

- The user object.

Defined in: Formio.ts:1728

___

### identity

▸ `Static`**identity**(`value`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *string* |

**Returns:** *string*

Defined in: Formio.ts:1860

___

### libraryReady

▸ `Static`**libraryReady**(`name`: *string*): *any*

Determines if a lazy loaded library is ready to be used.

**`description`** Example: Let's assume that the example provided at [Formio.requireLibrary](formio.formio-1.md#requirelibrary) was used elsewhere in your application.
You could now use the following within a separate place that will also resolve once the library is ready to be used.

```js
Formio.libraryReady('googleMaps').then(() => {
  // Once the promise resolves, the following can now be used within your application.
  const map = new google.maps.Map(document.getElementById("map"), {...});
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`name` | *string* | The name of the library to check.   |

**Returns:** *any*

- A promise that will resolve when the library is ready to be used.

Defined in: Formio.ts:2339

___

### loadProjects

▸ `Static`**loadProjects**(`query?`: *any*, `opts?`: *any*): *any*

Loads a list of all projects.

```ts
Formio.loadProjects().then((projects) => {
  console.log(projects);
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`query?` | *any* | Query parameters similar to {@link Formio#load}.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:429

___

### logout

▸ `Static`**logout**(`formio?`: *any*, `options?`: *any*): *any*

Performs a logout of the Form.io application. This will reset all cache, as well as make a request to the logout
endpoint of the Form.io api platform.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`formio?` | *any* | A Formio instance.   |
`options` | *any* | Options passed to both [Formio.setToken](formio.formio-1.md#settoken) as well as [Formio.setUser](formio.formio-1.md#setuser)   |

**Returns:** *any*

Defined in: Formio.ts:1996

___

### makeRequest

▸ `Static`**makeRequest**(`formio`: *any*, `type`: *string*, `url`: *string*, `method?`: *string*, `data?`: *any*, `opts?`: *any*): *any*

Make an API request and wrap that request with the Form.io Request plugin system.  This is very similar to the
{Formio.request} method with a difference being that it will pass the request through the Form.io request plugin.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`formio` | *any* | An instance of the Formio class.   |
`type` | *string* | The request resource type. "submission", "form", etc.   |
`url` | *string* | The URL to request.   |
`method?` | *string* | The request method. GET, PUT, POST, DELETE, or PATCH   |
`data?` | *any* | The data to pass to the request (for PUT, POST, and PATCH methods)   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:1367

___

### makeStaticRequest

▸ `Static`**makeStaticRequest**(`url`: *string*, `method?`: *any*, `data?`: *any*, `opts?`: *any*): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`url` | *string* |
`method?` | *any* |
`data?` | *any* |
`opts?` | *any* |

**Returns:** *any*

Defined in: Formio.ts:1336

___

### noop

▸ `Static`**noop**(): *void*

**Returns:** *void*

Defined in: Formio.ts:1859

___

### oAuthCurrentUser

▸ `Static`**oAuthCurrentUser**(`formio`: *any*, `token`: *string*): *any*

Much like [Formio.currentUser](formio.formio-1.md#currentuser), but instead automatically injects the Bearer tokens into the headers to
perform a Token swap of the OAuth token which will then return the JWT token for that user.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`formio` | *any* | The Formio instance   |
`token` | *string* | An OAuth Bearer token to use for a token swap between the OAuth provider and Form.io   |

**Returns:** *any*

Defined in: Formio.ts:2066

___

### oktaInit

▸ `Static`**oktaInit**(`options?`: *any*): *Promise*<unknown\>

Perform an Okta Authentication process using the [Okta SDK](https://developer.okta.com/code/javascript/okta_auth_sdk).

**`description`** This method does require that you first include the Okta JavaScript SDK within your application as follows.

First you need to include the Okta Authentication script.

```html
<script src="https://ok1static.oktacdn.com/assets/js/sdk/okta-auth-js/2.0.1/okta-auth-js.min.js" type="text/javascript"></script>
```

Then you can call this method as follows.

```ts
Formio.oktaInit();
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`options` | *any* | Options that are passed directly to the [Okta SDK constructor](https://github.com/okta/okta-auth-js#configuration-reference)   |

**Returns:** *Promise*<unknown\>

Defined in: Formio.ts:2162

___

### pageQuery

▸ `Static`**pageQuery**(): *any*

Returns the query passed to a page in JSON object format.

**`description`** For example, lets say you visit your application using
the url as follows.

```
  https://yourapplication.com/?token=23423423423&username=Joe
```

The following code will provide your application with the following.

```ts
const query Formio.pageQuery();
console.log(query.token); // Will print 23423423423
console.log(query.username); // Will print Joe
```

**Returns:** *any*

- A JSON object representation of the query that was passed to the URL of an application.

Defined in: Formio.ts:2034

___

### pluginAlter

▸ `Static`**pluginAlter**(`pluginFn`: *any*, `value`: *any*, ...`args`: *any*[]): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`pluginFn` | *any* |
`value` | *any* |
`...args` | *any*[] |

**Returns:** *any*

Defined in: Formio.ts:1919

___

### pluginGet

▸ `Static`**pluginGet**(`pluginFn`: *any*, ...`args`: *any*[]): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`pluginFn` | *any* |
`...args` | *any*[] |

**Returns:** *any*

Defined in: Formio.ts:1899

___

### pluginWait

▸ `Static`**pluginWait**(`pluginFn`: *any*, ...`args`: *any*[]): *Promise*<any[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`pluginFn` | *any* |
`...args` | *any*[] |

**Returns:** *Promise*<any[]\>

Defined in: Formio.ts:1894

___

### projectRoles

▸ `Static`**projectRoles**(`formio?`: *any*): *any*

Returns an array of roles for the project, which includes the ID's and names of those roles.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`formio?` | *any* | The Formio instance.   |

**Returns:** *any*

Defined in: Formio.ts:1945

___

### registerPlugin

▸ `Static`**registerPlugin**(`plugin`: *any*, `name`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`plugin` | *any* |
`name` | *string* |

**Returns:** *void*

Defined in: Formio.ts:1877

___

### request

▸ `Static`**request**(`url`: *string*, `method?`: *any*, `data?`: *any*, `header?`: *any*, `opts?`: *any*): *any*

Execute an API request to any external system. This is a wrapper around the Web fetch method.

```ts
Formio.request('https://examples.form.io').then((form) => {
  console.log(form);
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`url` | *string* | The URL to request.   |
`method?` | *any* | The request method. GET, PUT, POST, DELETE, or PATCH   |
`data?` | *any* | The data to pass to the request (for PUT, POST, and PATCH methods)   |
`header?` | *any* | An object of headers to pass to the request.   |
`opts?` | *any* | - |

**Returns:** *any*

Defined in: Formio.ts:1417

___

### requireLibrary

▸ `Static`**requireLibrary**(`name`: *string*, `property`: *string*, `src`: *string* \| *string*[], `polling?`: *boolean*): *any*

Lazy load a remote library dependency.

**`description`** This is useful for components that wish to lazy load a required library
by adding that library to the <scripts> section of the HTML webpage, and then provide a promise that will resolve
when the library becomes available for use.

**`example`** <caption>Load Google Maps API.</caption>
Formio.requireLibrary('googleMaps', 'google.maps.Map', 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap', true).then(() => {
  // Once the promise resolves, the following can now be used within your application.
  const map = new google.maps.Map(document.getElementById("map"), {...});
});

#### Parameters:

Name | Type | Default value | Description |
:------ | :------ | :------ | :------ |
`name` | *string* | - | The internal name to give to the library you are loading. This is useful for caching the library for later use.   |
`property` | *string* | - | The name of the global property that will be added to the global namespace once the library has been loaded. This is used to check to see if the property exists before resolving the promise that the library is ready for use.   |
`src` | *string* \| *string*[] | - | The URL of the library to lazy load.   |
`polling` | *boolean* | false | Determines if polling should be used to determine if they library is ready to use. If set to false, then it will rely on a global callback called ${name}Callback where "name" is the first property passed to this method. When this is called, that will indicate when the library is ready. In most cases, you will want to pass true to this parameter to initiate a polling method to check for the library availability in the global context.   |

**Returns:** *any*

- A promise that will resolve when the plugin is ready to be used.

Defined in: Formio.ts:2244

___

### samlInit

▸ `Static`**samlInit**(`options?`: *any*): *any*

Perform a SAML initialization.

**`description`** Typically, you would use the [Formio.ssoInit](formio.formio-1.md#ssoinit) method to perform this function
since this method is an alias for the following.

```ts
Formio.samlInit();
Formio.ssoInit('saml');  // This is the exact same thing as calling Formio.samlInit
```

This method will return false if the process is just starting. The code below is a typical block of code that is
used to automatically trigger the SAML authentication process within your application using a Button component.

```ts
if (Formio.pageQuery().saml) {
  const sso = Formio.samlInit();
  if (sso) {
    sso.then((user) => {
      // The SSO user is now loaded!
      console.log(user);
    });
  }
}
```

You can then place the following code withiin the "Custom" action of a Button component on your form.

```ts
Formio.samlInit();
```

Now when you click on this button, it will start the handshake process with SAML, and once it returns, will pass
a "saml" query parameter back to your application which will execute the code to load the current user from SAML.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`options` | *any* | Options to pass to the SAML initialization process.   |

**Returns:** *any*

Defined in: Formio.ts:2114

___

### serialize

▸ `Static`**serialize**(`obj`: *any*, `_interpolate?`: *any*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`obj` | *any* |
`_interpolate?` | *any* |

**Returns:** *string*

Defined in: Formio.ts:1300

___

### setApiUrl

▸ `Static`**setApiUrl**(`url`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`url` | *string* |

**Returns:** *void*

Defined in: Formio.ts:1781

___

### setAppUrl

▸ `Static`**setAppUrl**(`url`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`url` | *string* |

**Returns:** *void*

Defined in: Formio.ts:1789

___

### setAuthUrl

▸ `Static`**setAuthUrl**(`url`: *string*): *void*

The Auth URL can be set to customize the authentication requests made from an application. By default, this is
just the same value as [Formio.projectUrl](formio.formio-1.md#projecturl)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`url` | *string* | The authentication url    |

**Returns:** *void*

Defined in: Formio.ts:1812

___

### setBaseUrl

▸ `Static`**setBaseUrl**(`url`: *string*): *void*

Sets the BaseURL for the application.

**`description`** Every application developed using the JavaScript SDK must set both the [Formio.setBaseUrl](formio.formio-1.md#setbaseurl) and
[Formio.setProjectUrl](formio.formio-1.md#setprojecturl) methods. These two functions ensure that every URL passed into the constructor of this
class can determine the "project" context for which the application is running.

Any Open Source server applications will set both the [Formio.setBaseUrl](formio.formio-1.md#setbaseurl) and [Formio.setProjectUrl](formio.formio-1.md#setprojecturl)
values will be the same value.

```ts
Formio.setBaseUrl('https://yourwebsite.com/forms');
Formio.setProjectUrl('https://yourwebsite.com/forms/project');

// Now the Formio constructor will know what is the "project" and what is the form alias name. Without setBaseUrl
// and setProjectUrl, this would throw an error.

const formio = new Formio('https://yourwebsite.com/forms/project/user');
formio.loadForm().then((form) => {
  console.log(form);
});
```

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`url` | *string* | The URL of the Base API url.    |

**Returns:** *void*

Defined in: Formio.ts:1765

___

### setPathType

▸ `Static`**setPathType**(`type`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`type` | *string* |

**Returns:** *void*

Defined in: Formio.ts:2350

___

### setProjectUrl

▸ `Static`**setProjectUrl**(`url`: *string*): *void*

Sets the Project Url for the application. This is an important method that needs to be set for all applications. It
is documented @ [Formio.setBaseUrl](formio.formio-1.md#setbaseurl).

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`url` | *string* | The project api url.    |

**Returns:** *void*

Defined in: Formio.ts:1801

___

### setToken

▸ `Static`**setToken**(`token?`: *any*, `opts?`: *any*): *any*

Sets the JWT in storage to be used within an application.

#### Parameters:

Name | Type | Default value | Description |
:------ | :------ | :------ | :------ |
`token` | *any* | '' | The JWT token to set.   |
`opts` | *any* | - | - |

**Returns:** *any*

Defined in: Formio.ts:1614

___

### setUser

▸ `Static`**setUser**(`user`: *any*, `opts?`: *any*): *void*

Sets the current user within the application cache.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`user` | *any* | JSON object of the user you wish to set.   |
`opts` | *any* | - |

**Returns:** *void*

Defined in: Formio.ts:1689

___

### ssoInit

▸ `Static`**ssoInit**(`type`: *string*, `options?`: *any*): *any*

A common static method to trigger any SSO processes. This method is really just an alias for other static methods.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`type` | *string* | The type of SSO to trigger. 'saml' is an alias for [Formio.samlInit](formio.formio-1.md#samlinit), and 'okta' is an alias for [Formio.oktaInit](formio.formio-1.md#oktainit).   |
`options` | *any* | Options to pass to the specific sso methods   |

**Returns:** *any*

Defined in: Formio.ts:2213
