/* eslint-disable */
import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

import * as data from "../../framework/data/data";
import { router } from "../../framework/subpage/subpage";

class PMap extends Plugin {
  // eslint-disable-next-line
  constructor($element) {
    super($element);
    const self = this;
    let $items;
    this.$element = $element;
    this.$items = $element.find(".p-map__sections");
    const $map = $element.find(".map");

    function onSubpageShow(event, params) {
      if ($items) {
        $element
          .find(".map-point")
          .removeClass("map-point_visible")
          .destroyPlugins()
          .remove();
      }
      data.getData(`#${params.id}`).then(info => {
        $items = $element.find(".map__points").templateEngine(info);
        $map.map1("findNearestPoints", $items);

        self.select(info.$id);
        router.updatePageLinks();
      });
    }

    $(window).on('subpage:update', function(){
      // self.$items.eq(0).animate({'height': '500px'}, 300);
      // self.$items.addClass("p-map__sections_inactive", 1000, "easeInBack"  );
    })

    $element
      .closest(".subpage")
      .on("subpage:show subpage:update", onSubpageShow);

    $element.addClass("p-map_in");
  }

  select(id) {
    // let $curItem = $(Object.values(this.$items).filter(function(x){return $(x).hasClass('is-selected')}));
    this.$items.removeClass("p-map__sections_active");
    let $item = id && this.$items.filter(`[data-id="${id}"]`);
    if (!$item || $item.length === 0) $item = this.$items.eq(0);
    $item.addClass("p-map__sections_active");
  }
}

registerPlugins({
  name: "pMap",
  Constructor: PMap,
  selector: ".p-map"
});
