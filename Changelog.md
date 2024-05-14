## 2.1.0-rc.1
### Changed
 - FIO 7488: improve error handling
   
## 2.0.1
### Changed
 - Official Release

## 2.0.1-rc.1
### Changed
 - FIO-8264: update validate required

## 2.0.0
### Changed
 - Official Release

## 2.0.0-rc.32
### Changed
 - revert: change filter processor to be more verbose and have compModelType in …
   
## 2.0.0-rc.31
### Changed
 - FIO-8210: fix nested form validation
 - change filter processor to be more verbose and have compModelType in …

## 2.0.0-rc.30
### Changed
 - FIO-8177: fix unsetting empty array values
 - FIO-8185: Fixing issues with EditGrid and DataGrid clearOnHide with Conditionally visible elements.

## 2.0.0-rc.29
### Changed
 - FIO-8178: correctly add "validator" param to interpolated error object

## 2.0.0-rc.28
### Changed
 - Fix json and custom validation errors response

## 2.0.0-rc.27
 - FIO-8128: allow export of dist minified js
   
## 2.0.0-rc.26
### Changed
 - FIO-8128: allow export of dist minified js

## 2.0.0-rc.25
### Changed
 - FIO-8143: update eachComponent to be able to return proper pathing

## 2.0.0-rc.24
### Changed
 - FIO-8106: add default storeas value to tags
 - FIO-8106: add invalidDate error translation

## 2.0.0-rc.23
### Changed
 - Fix: JSONLogic validations should get same context as calculations
   
## 2.0.0-rc.22
### Changed
 - FIO-7146: gh actions for repository
 - FIO-8100: add clearhidden processor to cover logic, conditions, and custom
 - FIO-8101: always process json validation even if value is falsy
 - FIO-8107: correct small error in normalize processor
   
## 2.0.0-rc.21
### Changed
 - FIO-8092: update isEmpty to isComponentDataEmpty and account for differing component data types

## 2.0.0-rc.20
### Changed
 - FIO-8086: don't multiple validate select components
 - FIO-8079: add stricter time validation
   
## 2.0.0-rc.19
### Changed
 - FIO-8047: add dereferencing processor for datatable comp
   
## 2.0.0-rc.18
### Changed
 - FIO-8055: validate components that include custom validations, even when their data is empty
 - FIO-8049: fix value prop in evaluations
 - FIO-8040: add functions from formiojs
 - restructure conditional processor to fix conditional components in emails

## 2.0.0-rc.17
### Changed
 - FIO-8023: Fixing issues with the parent traversal on deeply nested components within nested forms
   
## 2.0.0-rc.16
 - FIO-7884: Fixed issues with processing data within nested form data structures

## 2.0.0-rc.14
### Changed
 - FIO-7884: Fixed an issue with nested form data where it would not set correctly
 - FIO-7938: Fixing issues where components within Array components (like datagrid) would get the path of the first index assigned and would never update again
 - FIO-7958: add asynchronous rule set
 - FIO-7958: fix typo in normalize processor fn
 - FIO-7998: add validate captcha rule
 - FIO-7991: Fixing the time validation to use the dataFormat for validation, which is what the client passes along to the server
 - skip processing if row is null or undefined

## 2.0.0-rc.13
 - FIO-7958: add normalize processor fn and derive context.value rather than mutate it directly
   
## 2.0.0-rc.11
 - FIO-7883: include premium components in 'multiple' validation conditional
 - FIO-7885: Make the core validator run the skipValidation checks similar to renderer checks
 - fix calculation for nested forms
 - FIO-7938: Fixing the fetch process to evaluate properly on the server
 - FIO-7874: Fixed issues with 'Invalid Time' when submitting a time component
 - FIO-7733: move unused 'experimental' features to a new folder and remove them f
 - Processor changes to work with other forms and validation processes
 - scopes updated and other little updates
 - Adding processors for server-side data processing
 - Ensure we do not 'append' jwt tokens but set them
   
## 2.0.0-rc.10
### Breaking Changes
 - This version of the renderer will now produce different "binary" build files. The following are created.
   - dist/formio.core.js => The complete core binary. This used to be "dist/index.js".
   - dist/formio.base.js => The base components of the core library. This used to be "dist/base/index.js"
   - dist/formio.components.js => The extended components classes of the core library. This used to be "dist/components/index.js"
   - dist/formio.model.js => This is the data model base classes for the renderer. This used to be "dist/model/index.js"
   - dist/formio.modules.js => The different modules such as "jsonlogic" used when rendering. This used to be "dist/modules/index.js"
   - dist/formio.js => The Formio SDK => this used to be "dist/sdk/index.js"
   - dist/formio.utils.js => The Formio Utils library => this used to be "dist/utils/index.js"
   - dist/formio.template.js => The template handling library => this used to be "dist/template/index.js"
   - dist/formio.process.js => The processing engine, such as validation => this used to be "dist/process/index.js"

 - This version introduces the "processors" concept to our core library. This will become the "core" validation engine and data processing engine for
   our renderer as well as server side logic.

 - This version introduces the "template" handling logic so that it can be used by other libraries to manage templates.

## 1.3.0-rc.22
### Fixed
 - FIO-7462: fix failing tests

## 1.3.0-rc.20
### Changed
 - Adding form and instance proxies

## 1.3.0-rc.18
### Fixed
 - revert accidental deletion of templateSettings

## 1.3.0-rc.16
### Fixed
 - Adding exports to libraries.

## 1.3.0-rc.14
### Fixed
 - Issue with invalid alias when loading a form with form revision.

## 1.3.0-rc.13
### Fixed
 - FIO-6832: fixed issue where submission used wrong _fvid

### Changed
 - Upgrade all dependencies to latest versions.

## 1.3.0-rc.9
 - Upgrade all dependencies to latest versions.

## 1.3.0-rc.8
## 1.3.0-rc.7
### Fixed
 - Fixed the ejs.js template import.

## 1.3.0-rc.6
### Changed
 - Fixed the export lib to contain relative paths for easy import.

## 1.3.0-rc.5
### Changed
 - Fixing the lib to contain production build of js files.

## 1.3.0-rc.4
### Changed
 - "main" in package.json changed to "dist" to support imports into other libraries.

## 1.3.0-rc.2 - 1.3.0-rc.3
### Changed
 - Experiment with typescript paths and imports.

## 1.3.0-rc.1
### Changed
  - Added types for core formio entities
  - Missing commits from formio.js implemented

## 1.2.0
### Fixed
 - FIO-6123: Added an array cleanup to the removeAttachedListeners method and wrote test for it

## 1.1.0
### Changed
 - FIO-5147: Added a check for an empty value

## 1.0.0
### Changed
 - Official Release

## 1.0.0-rc.5
### Fixed
 - FIO-3999: Fixed Data Table loading for IE11

## 1.0.0-rc.2
### Fixed
 - FIO-599: Fixes no values on pdf download for components inside nested form
 - FIO-2849: Fix: Evaluator does not interpolate expressions with optional chaining properly

## 0.0.8
### Changed
 - Added override method.

## 0.0.7
### Changed
 - Refactored array types.

## 0.0.6
### Changed
 - Added a Components.render method.

## 0.0.5
### Changed
 - How certain packages are imported.

## 0.0.4
### Chaanged
 - Added unwind functionality and more functions to the utils.

## 0.0.3
### Changed
 - Added some date conversion methods.

## 0.0.2
### Changed
 - Many refactorings and added data handling and basic inputs.

## 0.0.1
### Changed
 - Initial commit.
