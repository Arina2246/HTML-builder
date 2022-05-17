const fs = require('fs');
const path = require('path');
fs.promises.mkdir('06-build-page/project-dist', { recursive: true });
const pathToFile = path.join(__dirname, 'template.html');
const pathToFolderComponents = path.join(__dirname, 'components');
const pathToFinalFile = path.join(__dirname, 'project-dist', 'index.html');
const creatingFile = fs.createWriteStream(`${pathToFinalFile}`);
let arr = [];
fs.readFile(pathToFile, 'utf8', (err, data) => {
  arr = data.split('\r\n');
  const correctTag = [];
  const indexTag = [];

  for (let i = 0; i < arr.length; i++) {
    if (
      arr[i].trimStart()[0] === '{' &&
      arr[i].trimStart()[1] === '{' &&
      arr[i][arr[i].length - 1] === '}' &&
      arr[i][arr[i].length - 2] === '}'
    ) {
      indexTag.push(i);
      correctTag.push(
        `${arr[i].trimStart().slice(2, arr[i].trimStart().length - 2)}.html`
      );
    }
  }
  fs.promises
    .readdir(pathToFolderComponents, { withFileTypes: true }, (error) => {
      if (error) console.log(error);
    })
    .then((filesInComponentsFolder) => {
      const readFilePromises = [];
      const readFileNames = [];
      filesInComponentsFolder.forEach((file) => {
        const pathToFileComponents = path.join(
          __dirname,
          'components',
          `${file.name}`
        );
        if (correctTag.includes(file.name)) {
          readFilePromises.push(
            fs.promises.readFile(pathToFileComponents, 'utf8')
          );
          readFileNames.push(file.name);
        }
      });
      Promise.all(readFilePromises).then((responses) => {
        for (let i = 0; i < readFileNames.length; i++) {
          correctTag[correctTag.indexOf(readFileNames[i])] = responses[i];
        }
        for (let i = 0; i < indexTag.length; i++) {
          arr[indexTag[i]] = correctTag[i];
        }
        arr = arr.join('\r\n');
        creatingFile.write(arr);
      });
    });
});

// скидываю стили  в файлик
const pathToFolderStyle = path.join(__dirname, 'styles');
const pathToFolderStyle2 = path.join(__dirname, 'project-dist', 'style.css');
fs.readdir(
  pathToFolderStyle,
  { withFileTypes: true },
  (error, filesInFolder) => {
    const creatingFile = fs.createWriteStream(`${pathToFolderStyle2}`);
    if (error) console.log(error);
    else {
      filesInFolder.forEach((file) => {
        let ext = path.extname(`${pathToFolderStyle}/${file.name}`);
        if (file.isFile() && ext === '.css') {
          const readableFile = fs.createReadStream(
            `${pathToFolderStyle}/${file.name}`,
            'utf-8'
          );
          let data = [];
          readableFile.on('data', (chunk) => data.push(chunk));
          readableFile.on('end', () => creatingFile.write(data.toString()));
        }
      });
    }
  }
);
// ассетс
const pathToFolderAssets = path.join(__dirname, 'assets');
const pathToFolderAssets2 = path.join(__dirname, 'project-dist', 'assets');
fs.readdir(
  pathToFolderAssets,
  { withFileTypes: true },
  (error, filesInFolder) => {
    if (error) console.log(error);
    else {
      filesInFolder.forEach((file) => {
        if (file.isFile()) {
          fs.promises.copyFile(
            `${pathToFolderAssets}/${file.name}`,
            `${pathToFolderAssets2}/${file.name}`
          );
        } else {
          fs.promises
            .mkdir(`${pathToFolderAssets2}/${file.name}`, {
              recursive: true,
            })
            .then(() => {
              fs.readdir(
                `${pathToFolderAssets}/${file.name}`,
                (error, filesInFolder) => {
                  if (error) console.log(error);
                  else {
                    filesInFolder.forEach((file1) => {
                      fs.promises.copyFile(
                        `${pathToFolderAssets}/${file.name}/${file1}`,
                        `${pathToFolderAssets2}/${file.name}/${file1}`
                      );
                    });
                  }
                }
              );
            });
        }
      });
    }
  }
);
