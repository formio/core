const base64 = () => ({
  title: 'Base64',
  name: 'base64',
  uploadFile(file: any, fileName: any) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (event: any) => {
        const url = event.target.result;
        resolve({
          storage: 'base64',
          name: fileName,
          url: url,
          size: file.size,
          type: file.type,
        });
      };

      reader.onerror = () => {
        return reject(this);
      };

      reader.readAsDataURL(file);
    });
  },
  downloadFile(file: any) {
    // Return the original as there is nothing to do.
    return Promise.resolve(file);
  }
});

base64.title = 'Base64';
export default base64;
