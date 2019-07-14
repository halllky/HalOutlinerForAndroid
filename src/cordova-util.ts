// @ts-ignore
const isAndroid = () => typeof cordova !== 'undefined';

const download = (name: string, blob: Blob) => {
  // @ts-ignore
  const dirName = cordova.file.applicationStorageDirectory;
  const fileName = dirName + name;
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

export {
  isAndroid,
  download,
};
