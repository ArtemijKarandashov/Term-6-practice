import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class PPointInfo extends Plugin {
  // eslint-disable-next-line
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "pPointInfo",
  Constructor: PPointInfo,
  selector: ".p-point-info"
});
