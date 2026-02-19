/* eslint-disable */
import { Plugin, registerPlugins } from "../../framework/jquery/plugins/plugins";

class CustomPage extends Plugin {
  constructor($element) {
    super($element);
  }

  destroy() {}
}
registerPlugins({
  name: "customPage",
  Constructor: CustomPage,
  selector: ".custom-page"
});
