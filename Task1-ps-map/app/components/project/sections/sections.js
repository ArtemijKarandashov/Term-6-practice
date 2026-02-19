/* eslint-disable */
import $ from "jquery";
import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import * as rand from "../../framework/utils/random";

class Sections extends Plugin {
  // eslint-disable-next-line
	constructor($element) {
    super($element);
    const MAX_ITEMS_PER_ROW = 5; //  количество картинок в строке
    const $sections = $element.find(".sections__part");
    // const $page = $(".custom-page");
    // $page.removeClass('custom-page_not-index');
    // $page.css('border', 'vh(0px)');

    const speeds = [
      0,
      300,
      600,
      800,
      1000,
      1250,
      1500,
      1400,
      1600,
      500,
      800,
      1300
    ];

    const $content = $element.find(".custom-scroll__content").on("scroll", () => {
      $element.toggleClass("sections_scrolled", ($content[0].scrollHeight - $content.height()) - $content.scrollTop() < 1);
    });

    $element.toggleClass(
      "sections_scrollable",
      $content[0].scrollHeight > $content[0].offsetHeight
    );

    let startX, curX;
    $element
      .on('touchstart', function(e) { startX = e.touches[0].clientX;})
      .on('touchmove', function(e) {
        curX = e.touches[0].clientX;
        if ( Math.abs(curX - startX ) > 0 ) return false;
      });

    // $element.addClass(`sections_mod5_${$sections.length % MAX_ITEMS_PER_ROW}`);
    $element.toggleClass("sections_no-text", (($sections.length - 1) % MAX_ITEMS_PER_ROW) + 1 > MAX_ITEMS_PER_ROW - 2);

    setTimeout(function() {
      for (let i = 0; i < $sections.length; i += 1) {
        const index = rand.randInteger(0, speeds.length);
        speeds.splice(index, 1);
        const elem = $sections.eq(i);
        elem.css("transition-delay", `${speeds[index] / 1000}s`);
        elem.addClass("sections__part_animate");
      }
    }, 500);

    let sX, startY, cX, curY;
    $element
      .on('touchstart', function(e){sX = e.touches[0].clientX;startY = e.touches[0].clientY;})
      .on('touchmove', function(e){cX = e.touches[0].clientX;curY = e.touches[0].clientY;})
      .on('touchend', function(e){
        if((cX!=sX || curY!=startY) && cX!=undefined) {
          cX = undefined;
          curY = undefined;
          return false;
        }
        cX = undefined;
          curY = undefined;
      })
  }
}

registerPlugins({
  name: "sections",
  Constructor: Sections,
  selector: ".sections"
});
