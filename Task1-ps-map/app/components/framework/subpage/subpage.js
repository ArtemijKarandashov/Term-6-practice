/* eslint-disable */
import $ from "jquery";
import {registerPlugins} from "../jquery/plugins/plugins";
import Navigo from "navigo/lib/navigo";
import TemplateEngine from "../template-engine/template-engine";
import { URL } from "../utils/url";


import * as data from "../data/data";
import { $html } from "../../dom";

const VISIBLE = mod('visible');
const HIDE = mod('hide');
let $currentPage;

let sections = [];
let map = [];
let map_bg = [];
let map_id = '';
let color = [];
let is_starting = false;
let is_link = false;

const useHash = true; // location.protocol === "file:"

class SubpageController extends Navigo {
  constructor(){
    if (useHash) {
      super("", true, "#");
    } else {
      super(location.origin + base_url("/"), false, "#");
    }
    $html.one('document:ready', event=>{
      this.resolve();
    });
  }
}

class Subpage {
  isIndex = false;

  constructor($element) {

    const self = this;
    let hidePromise, $elementView;
    const _class = $element.data("class");

    this.show = show;
    this.hide = hide;
    // this.destroy = destroy;
    let template;
    if ($element.is(`[type="text/template"]`)) {
      template = TemplateEngine.compile($element.html());
    }


    let path = $element.data("page");
    let dataField = $element.data("data");
    this.isIndex = !path || path === "/";
    if (path) {
      router.on(path, show);
    } else {
      router.on(show);
    }

    $(window).on('change:point-info', function(e) {
      is_link = true;
    })

    function show(params, getParams) {
      if (useHash) {
        getParams = location.hash.split("?").slice(1).join("?");
      }
      params = $.extend({}, params, URL.parseQueryString(getParams));

      if (self === $currentPage && !is_link) {
        setTimeout(function() {
          $elementView.trigger("subpage:update", params);
          is_starting = false;

        }, 400)
        $(window).trigger("subpage:update", params);
        return;
      }
      is_link = false;

      if ($currentPage) {
        $currentPage.hide().then($currentPage.destroy()).done(_show);

      }

      else _show();

      function _show() {
        hidePromise = undefined;

        if (_class) {
          $html.addClass(_class);
        }
        $html.toggleClass("_no-index", !self.isIndex);
        if (data) {
          data.getData(undefined)
            .done(function(info){
              if (info.section) sections = info.section;
              if (info.map !== "") map = info.map;
              if (info.$id !== "") map = info.map;
              map_bg = info.map_bg;
              if (info.color_map !== "") color = info.color_map;
              data.getData((params && params.id) ? `#${params.id}` : undefined)
                .done(function (info) {
                  initPage(data.getParam(info, dataField));
                });
            });
        } else {
          initPage();
        }
      }

      function initPage(info) {

        if (!info.sections) info = Object.assign(info, {sections: sections});
        if (info.items) map_id = info.$id;
        for ( let i = 0; i < sections.length; i++ ) {
            let el = sections[i];
            for ( let j = 0; j < el.items.length; j++ ) {
              let item = el.items[j];
              if (item.$id === info.$id) {
                info = Object.assign(info, {map_id: el.$id});
              }
            }
          }
        // if (!info.map_id) info = Object.assign(info, {map_id: map_id});
        setTimeout(function() {
          var event = new CustomEvent( 'page:loaded', {detail:{info:info}} );
          window.dispatchEvent(event);
        }, 100)
        if (map_bg === undefined || map_bg === "") {
          for ( let i = 0; i < sections.length; i++ ) {
            let el = sections[i];
            if ( el.map_bg !== "" && el.map_bg !== undefined ) {
              map_bg = el.map_bg;
              break;
            }
          }
        }
        if (info.map_bg === undefined || info.map_bg === "") info = Object.assign(info, {map_bg: map_bg});
        info = Object.assign(info, {map: map});
        info = Object.assign(info, {color_map: color});
        if (info.media) {
          for ( let i = 0; i < info.media.length; i+=1 ) {
            let elem = info.media[i];
            for (let j = 0; j < elem.length; j++) {
              info.media[i][j].content_id = info.$id;
            }
          }
        }
        if (template) {
          $elementView = $(template(info)).insertAfter($element).initPlugins();
        } else {
          $elementView = $element;
        }

        $elementView.addClass(VISIBLE).removeClass(HIDE);
        $element.trigger("subpage:show");
        $elementView.trigger("subpage:show", params);
        $currentPage = self;
        router.updatePageLinks();
      }
    }

    function hide() {
      if (!hidePromise) {
        const def = $.Deferred();
        if ($elementView) {
          $elementView
            .on("animationend", done)
            .addClass(HIDE);
        } else {
          done();
        }
        hidePromise = def.promise();

        function done() {
          if ($elementView){
            $elementView.destroyPlugins();
            $elementView.detach();
            $elementView = undefined;
          }
          if (_class) {
            $html.removeClass(_class);
          }

          def.resolve();
        }
      }

      return hidePromise;
    }

  }

  destroy() {
    return function () {
      // if ($elementView) {
      //   $elementView.destroyPlugins();
    //
      //   if (template) {
      //     $elementView.remove();
      //   }
    //
      // }
    }
  }
}



function mod($mod) {
  return `subpage_${$mod}`;
}


export const router = new SubpageController();
registerPlugins(
  {
    name: "subpage",
    Constructor: Subpage,
    selector: "[data-page]"
  }
);
