const fs = require('fs');
const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, { withFileTypes: true }, (error, filesInFolder) => {
  if (error) console.log(error);
  else {
    filesInFolder.forEach((file) => {
      if (file.isFile()) {
        let fileName = file.name;
        fileName = fileName.replace(/[.]/g, ' - ');

        const pathToFile = path.join(__dirname, 'secret-folder', file.name);

        fs.stat(pathToFile, (error, stats) => {
          if (error) {
            console.log(error);
          } else {
            const cizeOfFile = stats.size / 1000 + 'kb';
            const result = fileName + ' - ' + cizeOfFile;
            console.log(result);
          }
        });
      }
    });
  }
});
