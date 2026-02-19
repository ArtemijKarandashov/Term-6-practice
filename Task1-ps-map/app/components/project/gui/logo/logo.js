import {
  registerPlugins,
  Plugin
} from "../../../framework/jquery/plugins/plugins";
import * as data from "../../../framework/data/data";

class Logo extends Plugin {
  // eslint-disable-next-line
  constructor($element) {
    super($element);

    data.getData().then(info => {
      $element.attr("src", info.image);
    });
  }
}

registerPlugins({
  name: "logo",
  Constructor: Logo,
  selector: ".logo"
});
