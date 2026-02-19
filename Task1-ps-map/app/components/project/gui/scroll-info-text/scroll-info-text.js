/* eslint-disable */
import $ from "jquery";
import { registerPlugins } from "../../../framework/jquery/plugins/plugins.js";
import "./lib/jquery.nicescroll";

class ScrollInfoText {
  constructor($element) {
    const $sursor = $element.find('.nicescroll-cursors');
    const $content = $element
      .children(".scroll-info-text__content")
      .on("scroll", function(e) {
        if (this.scrollTop + 100 > this.scrollHeight - $(this).height()) {
          $element.trigger("scroll-info-text:total-scroll");
        }
      });
    this.niceScroll = $content.niceScroll({
      // autohidemode: false,
      cursorcolor: "#BFA9FF",
      cursorwidth: "1vh",
      cursorborder: "none",
      cursorborderradius: "0px",
      autohidemode: false,
      background: "#e3e3e3",
      scrollspeed: 100,
      touchbehavior: true,
      preventmultitouchscrolling: false,
      emulatetouch: true,
      cursordragontouch: true,
      mousescrollstep: 50
    });
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
    $sursor.css('width', '20vh');
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
} registerPlugins({
  name: "scrollInfoText",
  Constructor: ScrollInfoText,
  selector: ".scroll-info-text"
});
