// @ts-ignore
const isAndroid = () => typeof cordova !== 'undefined';

const download = (name: string, blob: Blob) => {
  const execDownload = () => {
    // @ts-ignore
    const dirName = cordova.file.externalRootDirectory;
    const fileName = `${dirName}Download/${name}`;
    window.resolveLocalFileSystemURL(
      dirName,
      (entry: Entry) => {
        const fr = new FileReader();
        fr.onloadend = () => {
          new FileTransfer().download(
            fr.result as string,
            fileName,
            (entry2: FileEntry) => alert('download complete to \n' + entry2.fullPath),
            (error2: FileTransferError) => alert('download error code: ' + error2.exception + '\n' + error2.body),
            true,
          );
        };
        fr.readAsDataURL(blob);
      },
      (error: FileError) => {
        alert('resolve error: ' + error.code + '\n' + fileName);
      },
    );
  };
  try {
    // @ts-ignore
    const per = cordova.plugins.permissions;
    per.checkPermission(
      per.WRITE_EXTERNAL_STORAGE,
      (statusBeforeRequest: any) => {
        if (statusBeforeRequest.hasPermission) {
          execDownload();
        } else {
          per.requestPermission(
            per.WRITE_EXTERNAL_STORAGE,
            (statusAfterRequest: any) => {
              if (statusAfterRequest.hasPermission) { execDownload(); }
            },
          );
        }
      },
    );
  } catch (error) {
    alert('permission error: ' + error);
  }
};

export {
  isAndroid,
  download,
};
