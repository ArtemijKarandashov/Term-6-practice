let path = require('path');
let read = require('../utils/read');

module.exports = sassImporter;

function sassImporter(options) {
  return function (url, prev, done) {
    if (/node_modules\/([^/]+\/)*[^/]+.css$/.test(url)) {
      let filePath = path.resolve(path.dirname(prev), url);
      // console.log(filePath);
      // if (!path.existsSync(filePath)) {
      //   throw new Error(`Импортируемый файл ${filePath} не найден`);
      // }
      // console.log('after ');
      return {
        contents: read(filePath, 'css')
      };
    }
    return null;
  }
}
