import { trim } from '../../util/lodash';
export const setXhrHeaders = (formio: any, xhr: any) => {
  const { headers } = formio.options;
  if (headers) {
    const ValidHeaders: any = {
      'Content-Disposition': true,
    };

    for (const header in headers) {
      if (ValidHeaders[header]) {
        xhr.setRequestHeader(header, headers[header]);
      }
    }
  }
};
const XHR = {
  trim(text: string) {
    return trim(text, '/');
  },
  path(items: any) {
    return items.filter((item: any) => !!item).map(XHR.trim).join('/');
  },
  upload(
    formio: any,
    type: any,
    xhrCb: any,
    file: any,
    fileName: any,
    dir: any,
    progressCallback: any,
    groupPermissions: any,
    groupId: any,
    abortCallback: any
  ) {
    return new Promise(((resolve, reject) => {
      // Send the pre response to sign the upload.
      const pre = new XMLHttpRequest();

      // This only fires on a network error.
      pre.onerror = (err: any) => {
        err.networkError = true;
        reject(err);
      };

      pre.onabort = reject;
      pre.onload = () => {
        if (pre.status >= 200 && pre.status < 300) {
          const response = JSON.parse(pre.response);

          // Send the file with data.
          const xhr = new XMLHttpRequest();

          if (typeof progressCallback === 'function') {
            xhr.upload.onprogress = progressCallback;
          }

          if (typeof abortCallback === 'function') {
            abortCallback(() => xhr.abort());
          }

          (xhr as any).openAndSetHeaders = (
            method: string,
            url: string,
            async: boolean = true,
            user: any = null,
            password: any = null
          ) => {
            xhr.open(method, url, async, user, password);
            setXhrHeaders(formio, xhr);
          };

          // Fire on network error.
          xhr.onerror = (err: any) => {
            err.networkError = true;
            reject(err);
          };

          // Fire on network abort.
          xhr.onabort = (err: any) => {
            err.networkError = true;
            reject(err);
          };

          // Fired when the response has made it back from the server.
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(response);
            }
            else {
              reject(xhr.response || 'Unable to upload file');
            }
          };

          // Set the onabort error callback.
          xhr.onabort = reject;

          // Get the request and send it to the server.
          xhr.send(xhrCb(xhr, response));
        }
        else {
          reject(pre.response || 'Unable to sign file');
        }
      };

      pre.open('POST', `${formio.formUrl}/storage/${type}`);
      pre.setRequestHeader('Accept', 'application/json');
      pre.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      const token = formio.getToken();
      if (token) {
        pre.setRequestHeader('x-jwt-token', token);
      }

      pre.send(JSON.stringify({
        name: XHR.path([dir, fileName]),
        size: file.size,
        type: file.type,
        groupPermissions,
        groupId,
      }));
    }));
  }
};

export default XHR;
