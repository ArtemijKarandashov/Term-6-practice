/* eslint-disable */
import $ from "jquery";
import { Plugin, registerPlugins } from "../jquery/plugins/plugins";
import { popup } from "../utils/window";

class Share extends Plugin {
  constructor($element) {
    super($element);
    this.$element = $element;
    this.soc = this.$element.data("share");

    $element.on("click", $event => {
      $event.preventDefault();

      popup(this.link);
    });
  }

  getSoc() {
    return this.soc;
  }

  defaultAction(action, ...args) {
    const link = typeof action === "string" ? action : action && action.link;
    this.$element.attr(
      "href",
      (this.link = getShareLinks(link, this.soc, ...args))
    );
  }
}

registerPlugins({
  name: "share",
  Constructor: Share,
  selector: ".share"
});

export function getShareLinks(link, social, text) {
  if (text === false) {
    text = "";
  } else if (!text) {
    const $title = $('meta[property="og:title"]').attr("content");
    const $desc = $('meta[property="og:description"]').attr("content");
    const $twitter = $('meta[name="twitter_text"]').attr("content");

    switch (social) {
      case "tg":
      case "wa":
        text = `${$title} ${$desc}` + "\r\n";
        break;
      case "tw":
        text = $twitter || `${$title} ${$desc}`;
        break;
      default:
        text = "";
        break;
    }
  }

  return initLink(link || location.href, social, text || "");
}

function initLink(link, social, text) {
  link = encodeURIComponent(extendLink(link, social));
  text = encodeURIComponent(text);

  const links = {
    vk: `http://vk.com/share.php?url=${link}`,
    fb: `http://www.facebook.com/sharer.php?u=${link}`,
    ok: `https://connect.ok.ru/offer?url=${link}`,
    tw: `https://twitter.com/intent/tweet?text=${text}&url=${link}`,

    whatsapp: `whatsapp://send?text=${link}`,
    wa: `https://wa.me?text=${text}${link}`,

    // tg:`tg://msg?text=${ text } ${ link }`,
    // tg:`tg://share?url=${ link }&text=${ text }`,
    tg: `https://telegram.me/share/url?url=${link}&text=${text}`
  };

  return social
    ? links.hasOwnProperty(social)
      ? links[social]
      : links
    : links;
}

function extendLink(link, social) {
  return link.replace(/^([^?]+)(\?[^#]+)?/, ($0, $1, $2) => {
    let query = "?";
    if ($2) {
      query += `${$2
        .substr(1)
        .split("&")
        .filter(itm => itm.split("=").pop() !== "utm_source")
        .join("&")}&`;
    }
    return `${$1}${query}utm_source=${social}_share`;
  });
}
