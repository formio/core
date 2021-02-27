import { uniqueName } from '../../util/formUtil';

/**
 * UploadAdapter for CKEditor https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html
 */
class FormioUploadAdapter {
  constructor(public loader: any, public fileService: any, public component: any) {}

  upload() {
    return this.loader.file
      .then((file: any) => new Promise((resolve, reject) => {
        const { uploadStorage, uploadUrl, uploadOptions, uploadDir, fileKey } = this.component.component;
        const uploadParams = [
          uploadStorage,
          file,
          uniqueName(file.name),
          uploadDir || '', //should pass empty string if undefined
          (evt: any) => this.onUploadProgress(evt),
          uploadUrl,
          uploadOptions,
          fileKey,
          null,
          null
        ];

        const uploadPromise = this.fileService.uploadFile(
          ...uploadParams,
          () => this.component.emit('fileUploadingStart', uploadPromise)
        ).then((result: any) => {
          return this.fileService.downloadFile(result);
        }).then((result: any) => {
          return resolve({
            default: result.url
          });
        }).catch((err: any) => {
          console.warn('An Error occured while uploading file', err);
          reject(err);
        }).finally(() => {
          this.component.emit('fileUploadingEnd', uploadPromise);
        });
      }));
  }

  abort() {}

  onUploadProgress(evt: any) {
    if (evt.lengthComputable) {
      this.loader.uploadTotal = evt.total;
      this.loader.uploaded = evt.loaded;
    }
  }
}

const getFormioUploadAdapterPlugin = (fileService: any, component: any) => (editor: any) => {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new FormioUploadAdapter(loader, fileService, component);
  };
};

export { getFormioUploadAdapterPlugin };
