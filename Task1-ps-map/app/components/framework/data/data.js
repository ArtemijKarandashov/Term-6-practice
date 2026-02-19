import * as url1 from "../utils/url";
/* eslint-disable */
(function(factory) {
  module.exports = factory(
    require("jquery"),
    require("url"),
    require("handlebars")
  );
})(function($, url, Handlebars) {
  const promise = $getData();
  let host;
  const result = {
    getParam,
    getData
  };

  function getParam(data, param) {
    if (!param) return data;

    if (!Array.isArray(param)) {
      if (typeof param !== "string") {
        throw new Error("param must be Array or String");
      }
      param = param.split(".");
    }

    return param.reduce(function(value, name) {
      return value && value[name];
    }, data);
  }

  function getData(obj) {
    const def = $.Deferred();

    promise
      .done(function(data) {
        data = select(data, obj);
        !result.data && (result.data = data);

        def.resolve(data);
      })
      .fail(function(err) {
        console.error( err );
      });

    return def.promise();

    function select(data, id) {
      if (!id) return data.data;

      switch (typeof id) {
        case "string":
          if (/^#/.test(id)) {
            return _get(id.substr(1));
          }
          break;
        case "object":
          const _res = {};
          for (const p in id) {
            if (id.hasOwnProperty(p)) {
              _res[p] = select(data, id[p]);
            }
          }
          return _res;
      }

      return id;

      // if (!id) return data;
      // return getParam(data, id.split(".").slice(1));

      function _get(id) {
        return data.dictionary && data.dictionary.hasOwnProperty(id)
          ? data.dictionary[id]
          : data.data;
      }
    }
  }

  return result;

  function $getData() {
    const def = $.Deferred();

    const _params = url.parse(location.href, true);
    const _dataURL = _params.query.data || "./content/data.json"; //
    if (_dataURL) {
      const base_url = getBaseUrl(_dataURL);
      // window.DATA = _dataURL;
      Handlebars.registerHelper("base_url", base_url);

      $.when($.getJSON(_dataURL))
        .then(initData(base_url))
        .then(initPointInfo(base_url))
        .then(initSections())
        .done(function(data) {
          def.resolve(data);
        })
        .fail(function() {
          def.reject();
        });
    }

    return def.promise();
  }

  function getBaseUrl(dataURL) {
    const base_url = `${dataURL
      .split("/")
      .slice(0, -1)
      .join("/")}/`;
    return function(url) {
      if (!isAbsolute(url)) {
        return base_url + url;
      }

      return url;
    };

    function isAbsolute(url) {
      return url
        ? /^(https?|s?ftp|file):\/\//.test(url) ||
            url.substr(0, base_url.length) === base_url
        : false;
    }
  }

  function initSections() {
    return data => {
      data.data.section.forEach(section => {
        section.section = data.data.section;
        section.items.forEach(item => {
          item.section = section;
        });
      });

      return data;
    }
  }
  function initPointInfo() {
    return data => {
      let sections = data.data.section;
      const link = url1.URL.parseQueryString(window.location.href);
      const pageId = Object.values(link)[0];
      let media;
      outer:
      for (let i = 0; i < sections.length; i += 1) {
        const section = sections[i];
        const { items: points } = section;
        if (points.length) {
          for (let j = 0; j < points.length; j += 1) {
            const point = points[j];
            ({ media } = point);
            point.carousel_media = media;
            let new_media = [];
            // for ( var k = 0; k < media.length; k+=3) {
            //   if (k+1 >= media.length) {
            //     new_media.push([media[k]]);
            //   } else {
            //     if (k+2 >= media.length) {
            //       new_media.push([media[k], media[k + 1]]);
            //     } else{
            //       if (k+3 > media.length) new_media.push([media[k], media[k + 1], media[k + 2]]);
            //       else new_media.push([media[k], media[k + 1], media[k + 2], media[k + 3]]);

            //     }
            //   }
            // }

            for ( var k = 0; k < media.length; k+=2) {
              if (k+1 >= media.length) {
                new_media.push([media[k]]);
              } else new_media.push([media[k], media[k + 1]]);
            }
            point.media = undefined;
            point.media = new_media;
          }
        }
      }
      let start_href = window.location.origin
      let timeout;
      let $back_btn, $close_btn;
      let is_clicked = false;
      timeout = setTimeout(goToStartPage, data.data.timeout * 1000 )
      window.addEventListener('touchstart', clearTimeoutS)
      window.addEventListener('touchend',clearTimeoutS)
      window.addEventListener('touchmove', clearTimeoutS)
      window.addEventListener('click',clearTimeoutS)
      window.addEventListener('video_paused', function(e, param){
        timeout = setTimeout(goToStartPage, data.data.timeout * 1000 )
        is_clicked = false;

      })
      window.addEventListener('video_playing', function(e, param){
        is_clicked = true;
        clearTimeout(timeout);
      })

      // if ( $('.p-map__close-button').length ) $back_btn = $('.p-map__close-button');
      // if ( $('.custom-modal__close-btn').length ) $close_btn = $('.custom-modal__close-btn');
      function goToStartPage() {
        if ( $('.p-map__close-button').length ) $back_btn = $('.p-map__close-button');
        if ( $('.custom-modal__close-btn').length ) $close_btn = $('.custom-modal__close-btn');
        if (is_clicked) return;
        if (window.location.href != start_href || window.location.href != start_href + '/' || window.location.href != start_href + '/#') {
          setTimeout(function(){ 
            if ($('.custom-modal__close-btn').length ) $close_btn[0].click()
            setTimeout(function() {$back_btn[0].click()}, 100);
          }, 100);
          // $back_btn.trigger('click');

          // window.location.href = start_href;
          // setTimeout(function() {
            // var event = new CustomEvent( 'go_to_start_page' );
            // window.dispatchEvent(event);
          // }, 200);
        }
        timeout = setTimeout(goToStartPage, data.data.timeout * 1000 )
      }

      function clearTimeoutS() {
        if ( $('.p-map__close-button').length ) $back_btn = $('.p-map__close-button');
        if ( $('.custom-modal__close-btn').length ) $close_btn = $('.custom-modal__close-btn');
        clearTimeout(timeout);
        timeout = setTimeout(goToStartPage, data.data.timeout * 1000 )
      }
      // тут разбиение
      return data;
    }
  }

  function initData(base_url) {
    const getHash = function(str, data) {
      let hash = 5381;
      let i = str.length;

      while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
      }
      return (hash >>> 0).toString(36);
    };

    return function(data) {
      // if (typeof data[0] === 'string') {
      //   try {
      //     data[0] = JSON.parse(data[0]);
      //   } catch (err) {
      //     console.error(err);
      //   }
      // }
      data = data.root[0];

      const dictionary = {};
      init(data, "$", dictionary);

      return {
        dictionary,
        data
      };
    };

    function init(data, id, dictionary, parent) {
      if (!data) {
        /* if (typeof data === "object") {
          console.log(">>>", id);
        } */
        return;
      }

      if (typeof data === "object") {
        if (!Array.isArray(data)) {
          const _id = getHash(id, data);
          dictionary[_id] = data;
          data.$id = _id;
        }
        for (const p in data) {
          if (data.hasOwnProperty(p)) {
            init(data[p], `${id}.${p}`, dictionary, data);
          }
        }
        // data.$$parent = parent;
      }
    }
  }
});
