import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class MediaModal extends Plugin {
  // eslint-disable-next-line
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "mediaModal",
  Constructor: MediaModal,
  selector: ".media-modal"
});
