const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'text.txt');

const { stdin, stdout } = process;
const creatingFile = fs.createWriteStream(`${pathToFile}`);
stdout.write('Процесс начался.Файл создан.Введите текст\n');
stdin.on('data', (txt) => {
  if (txt.toString() === 'exit\r\n') {
    process.exit();
  }
  creatingFile.write(txt);
});
process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => stdout.write('Процесс завершен.Удачи!'));
