import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class PIndex extends Plugin {
  // eslint-disable-next-line
  constructor($element) {
    super($element);

    $element.on(
      "touchmove",
      function onTouchMove(event) {
        event.preventDefault();
      },
      false
    );
  }
}

registerPlugins({
  name: "pIndex",
  Constructor: PIndex,
  selector: ".p-index"
});
