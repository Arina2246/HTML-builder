const fs = require('fs');
const path = require('path');
const pathToFolder = path.join(__dirname, 'styles');
const pathToFolder2 = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(pathToFolder, { withFileTypes: true }, (error, filesInFolder) => {
  const creatingFile = fs.createWriteStream(`${pathToFolder2}`);
  if (error) console.log(error);
  else {
    filesInFolder.forEach((file) => {
      let ext = path.extname(`${pathToFolder}/${file.name}`);

      if (file.isFile() && ext === '.css') {
        const readableFile = fs.createReadStream(
          `${pathToFolder}/${file.name}`,
          'utf-8'
        );

        let data = [];
        readableFile.on('data', (chunk) => data.push(chunk));
        readableFile.on('end', () => creatingFile.write(data.toString()));
      }
    });
  }
});
