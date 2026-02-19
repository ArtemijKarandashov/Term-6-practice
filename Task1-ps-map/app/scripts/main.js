import '../components/framework/subpage/subpage';
import '../components/project/project';

import $ from 'jquery';

global.jQuery = global.$ = $;

$.when(isDocumentReady())
  .done(onDocumentReady);

function onDocumentReady() {
  if ($.fn.initPlugins) {
    $(document.body).initPlugins();
  }
  $(document.documentElement).trigger("document:ready");
}


function isDocumentReady() {
  let def = $.Deferred();

  $(document).ready(()=>def.resolve());

  return def.promise();
}
