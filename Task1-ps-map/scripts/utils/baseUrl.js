module.exports = baseUrl;

function baseUrl(val, suffix) {
  return require('../gulp/config').pug.getData().base_url(val, suffix);
}
