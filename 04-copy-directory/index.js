const fs = require('fs');
const path = require('path');
const pathToFolder = path.join(__dirname, 'files');

fs.promises.mkdir('04-copy-directory/files-copy', { recursive: true });
const pathToFolder2 = path.join(__dirname, 'files-copy');

fs.readdir(pathToFolder, (error, filesInFolder) => {
  if (error) console.log(error);
  else {
    filesInFolder.forEach((file) => {
      fs.promises.copyFile(
        `${pathToFolder}/${file}`,
        `${pathToFolder2}/${file}`
      );
    });
  }
});
