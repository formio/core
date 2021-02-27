import XHR from './xhr';
const azure = (formio: any) => ({
  uploadFile(
    file: any,
    fileName: any,
    dir: any,
    progressCallback: any,
    url: any,
    options: any,
    fileKey: any,
    groupPermissions: any,
    groupId: any,
    abortCallback: any
  ) {
    return XHR.upload(formio, 'azure', (xhr: any, response: any) => {
      xhr.openAndSetHeaders('PUT', response.url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
      return file;
    }, file, fileName, dir, progressCallback, groupPermissions, groupId, abortCallback).then(() => {
      return {
        storage: 'azure',
        name: XHR.path([dir, fileName]),
        size: file.size,
        type: file.type,
        groupPermissions,
        groupId
      };
    });
  },
  downloadFile(file: any) {
    return formio.makeRequest('file', `${formio.formUrl}/storage/azure?name=${XHR.trim(file.name)}`, 'GET');
  }
});

azure.title = 'Azure File Services';
export default azure;
