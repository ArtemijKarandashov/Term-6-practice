/* eslint-disable */
import $ from "jquery";
import { registerPlugins } from "../../../framework/jquery/plugins/plugins.js";
import "./lib/jquery.nicescroll";

class CustomScroll {
  constructor($element) {
    const $section = $element.find('.sections__part');
    const section_width = parseInt($section.eq(0).css('height'));
    let lastScrollTop = 0;
    let lastlastScrollTop = 0;
    let scrolltime = false;
    let triggered_event = false;

    function scrollToSection($elem, offset) {
      $elem.animate({scrollTop: offset}, 550, function(){ 
        setTimeout(function(){triggered_event = false}, 200);
      });
    }
    const $content = $element
      .children(".custom-scroll__content")
      .on("scroll", function(e) {
        if (scrolltime && !triggered_event) {
          clearTimeout(scrolltime);
        }
        let curScroll = this.scrollTop;
        let $elem = $(this);
        if (!triggered_event) scrolltime = setTimeout(function(){
          triggered_event = true;
          if ( curScroll % section_width !== 0 ) {
            if (lastlastScrollTop >= curScroll) {
              if( curScroll % section_width > section_width / 2) 
                scrollToSection($elem, ( Math.floor(curScroll/section_width) + 1 ) * section_width - section_width);
            } 
            else scrollToSection($elem, Math.floor(curScroll/section_width) * section_width + section_width);
          }
          // triggered_event = false;
        }, 500)
       
        if (this.scrollTop + 100 > this.scrollHeight - $(this).height()) {
          $element.trigger("custom-scroll:total-scroll");
        }
        lastlastScrollTop = lastScrollTop;
        lastScrollTop = this.scrollTop;
      });
    let presets = {
      // autohidemode: false,
      cursorcolor: "#c0c0c0",
      cursorwidth: "7px",
      cursorborder: "none",
      cursorborderradius: "7px",
      background: "#e3e3e3",
      scrollspeed: 100,
      touchbehavior: true,
      horizrailenabled:false,
      preventmultitouchscrolling: false,
      emulatetouch: true,
      cursordragontouch: true,
      mousescrollstep: 50
    };
    if ( $section.length ) {
      presets['cursorwidth']='0px';
      presets['background']='#ffffff';
      presets['cursorcolor']='#ffffff';
    }

    this.niceScroll = $content.niceScroll(presets);

    const ClsMutationObserver = false; // window.MutationObserver || window.WebKitMutationObserver || false;

    if (ClsMutationObserver !== false) {
      this.observer = new ClsMutationObserver(mutations => this.update());
      this.observer.observe($content.get(0), {
        childList: true,
        attributes: true,
        subtree: true
      });
    } else {
      this.tick();
    }
  }

  init(action) {
    if (action && typeof this[action] === "function") {
      return this[action]();
    }
  }

  update() {
    this.niceScroll.onResize();
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      delete this.observer;
    }
    cancelAnimationFrame(this.raf);

    this.niceScroll.remove();
    delete this.niceScroll;
  }

  tick() {
    this.update();
    this.raf = requestAnimationFrame(() => this.tick());
  }
}
registerPlugins({
  name: "customScroll",
  Constructor: CustomScroll,
  selector: ".custom-scroll"
});
