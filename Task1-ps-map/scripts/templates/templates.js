const _ = require('lodash');
const read = require('../utils/read');
const toCamelCase = require('../utils/toCamelCase');

module.exports = function (type) {
  let template = _.template(read(`scripts/templates/template.${type}.lodash`));

  return function (componentName, appDir, relative) {
    return template({

      "author": JSON.stringify(require('../gulp/config').author()),
      "package": JSON.stringify(componentName),
      "description": JSON.stringify(`${componentName} - описание`),

      "componentName": componentName,
      "camelCase": toCamelCase(componentName),
      "className": toCamelCase(componentName, true),
      "relativePath": relative("/components/framework/jquery/plugins/plugins")
    });
  }
};
