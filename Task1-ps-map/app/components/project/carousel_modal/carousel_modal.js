import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class CarouselModal extends Plugin {
  // eslint-disable-next-line
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "carouselModal",
  Constructor: CarouselModal,
  selector: ".carousel_modal"
});
