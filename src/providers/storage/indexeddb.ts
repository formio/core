import { v4 as uuidv4 } from 'uuid';
const indexeddb = () => ({
  title: 'indexedDB',
  name: 'indexeddb',
  uploadFile(
    file: any,
    fileName: any,
    dir: any,
    progressCallback: any,
    url: any,
    options: any
  ) {
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
      return;
    }

    return new Promise((resolve) => {
      const request = indexedDB.open(options.indexeddb, 3);
      request.onsuccess = function(event: any) {
        const db = event.target.result;
        resolve(db);
      };
      request.onupgradeneeded = function(e: any) {
        const db = e.target.result;
        db.createObjectStore(options.indexeddbTable);
      };
    }).then((db: any) => {
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const blobObject: any = new Blob([file], { type: file.type });

          const id = uuidv4(blobObject);

          const data = {
            id,
            data: blobObject,
            name: file.name,
            size: file.size,
            type: file.type,
            url,
          };

          const trans = db.transaction([options.indexeddbTable], 'readwrite');
          const addReq = trans.objectStore(options.indexeddbTable).put(data, id);

          addReq.onerror = function(e: any) {
            console.log('error storing data');
            console.error(e);
          };

          trans.oncomplete = function() {
            resolve({
              storage: 'indexeddb',
              name: file.name,
              size: file.size,
              type: file.type,
              url: url,
              id,
            });
          };
        };

        reader.onerror = () => {
          return reject(this);
        };

        reader.readAsDataURL(file);
      });
    });
  },
  downloadFile(file: any, options: any) {
    return new Promise((resolve) => {
      const request = indexedDB.open(options.indexeddb, 3);

      request.onsuccess = function(event: any) {
        const db = event.target.result;
        resolve(db);
      };
    }).then((db: any) => {
      return new Promise((resolve, reject) => {
        const trans = db.transaction([options.indexeddbTable], 'readonly');
        const store = trans.objectStore(options.indexeddbTable).get(file.id);
        store.onsuccess = () => {
          trans.oncomplete = () => {
            const result = store.result;
            const dbFile = new File([store.result.data], file.name, {
              type: store.result.type,
            });

            const reader = new FileReader();

            reader.onload = (event: any) => {
              result.url = event.target.result;
              result.storage = file.storage;
              resolve(result);
            };

            reader.onerror = () => {
              return reject(this);
            };

            reader.readAsDataURL(dbFile);
          };
        };
        store.onerror = () => {
          return reject(this);
        };
      });
    });
  },
  deleteFile(file: any, options?: any) {
    return new Promise((resolve) => {
      const request = indexedDB.open(options.indexeddb, 3);

      request.onsuccess = function(event: any) {
        const db = event.target.result;
        resolve(db);
      };
    }).then((db: any) => {
      return new Promise((resolve, reject) => {
        const trans = db.transaction([options.indexeddbTable], 'readwrite');
        const store = trans.objectStore(options.indexeddbTable).delete(file.id);
        store.onsuccess = () => {
          trans.oncomplete = () => {
            const result = store.result;

            resolve(result);
          };
        };
        store.onerror = () => {
          return reject(this);
        };
      });
    });
  }
});

indexeddb.title = 'IndexedDB';
export default indexeddb;
