var argv = require('yargs').argv;
const _ = require('lodash');

let pages = ['index'];

const urls = {
  production: init('http://peppers-studio.ru', '.php'),
  localhost: init('http://localhost:9000'),
  file: init('./dist')
};

const config = require('./backstop.json');
if (argv.type !== undefined && urls[argv.type]) {

  config.scenarios = config.scenarios.reduce(
    (list, scenario) => {
      return list.concat(pages.map(page => _.assign(_.cloneDeep(scenario), {label:page, url: urls[argv.type](page)})))
    },
    []
  );
}
module.exports = config;


function init(domain,ext) {
  return page=>`${domain}/${page}${ext || ''}`;
}
