import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class ScrollText extends Plugin {
  // eslint-disable-next-line
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "scrollText",
  Constructor: ScrollText,
  selector: ".scroll-text"
});
