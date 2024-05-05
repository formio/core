declare const globalThis: any;
export default function mockBrowserContext() {
  if (!globalThis) return;
  if (!globalThis.Text) globalThis.Text = class {};
  if (!globalThis.HTMLElement) globalThis.HTMLElement = class {};
  if (!globalThis.HTMLInputElement) globalThis.HTMLInputElement = class {};
  if (!globalThis.HTMLTextAreaElement) globalThis.HTMLTextAreaElement = class {};
  if (!globalThis.navigator) globalThis.navigator = {userAgent: ''};
  if (!globalThis.document) globalThis.document = {
    createElement: () => ({}),
    cookie: '',
    getElementsByTagName: () => [],
    documentElement: {
      style: [],
      firstElementChild: {appendChild: () => {}}
    }
  };
  if (!globalThis.window) globalThis.window = {addEventListener: () => {}, Event: function() {}, navigator: globalThis.navigator};
  if (!globalThis.btoa) globalThis.btoa = (str: any) => {
    return (str instanceof Buffer) ?
      str.toString('base64') :
      Buffer.from(str.toString(), 'binary').toString('base64');
  }
  if (!globalThis.self) globalThis.self = global;
}