/* eslint-disable */
import {
  registerPlugins,
  Plugin
} from "../../../framework/jquery/plugins/plugins";
import { rand } from "../../../framework/utils/random";

class MapPoint extends Plugin {
  // eslint-disable-next-line
  constructor($element) {
    super($element);
    for (let i = 0; i < $element.length; i+=1) {
    	let $el = $element.eq(i);
    	let old_left = parseFloat($el.css('left'));
    	let old_top = parseFloat($el.css('top'));
    	// $el.next().css('left', (old_left + 0.016) * 100 + '%');
    	// $el.next().css('top', (old_top - .04) * 100 + '%');
    	$el.css('left', (old_left - 0.011) * 100 + '%');
    	$el.css('top', (old_top - .0) * 100 + '%');

    	const $points = $element
        .parent()
        .find(".map-point:not(.map-point_visible)");

    	setTimeout(() => {
    	  $element.addClass("map-point_visible");
      }, 50 * $points.index($element) + rand(30, 300));
    }
    let is_animated = false;
    $(window).on('subpage:update', function() {
      if (is_animated) return;
      $element.addClass("map-point_unvisible");

    })
  }
}

registerPlugins({
  name: "mapPoint",
  Constructor: MapPoint,
  selector: ".map-point"
});
