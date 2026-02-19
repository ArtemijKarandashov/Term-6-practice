/* eslint-disable */
import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import TemplateEngine from "../../framework/template-engine/template-engine";

TemplateEngine.registerHelper("shrink-text", shrinkText());
TemplateEngine.registerHelper("some-set", function someSet(...args) {
  const obj = args.pop();
  return args.reduce((res,item)=> res || item);
});

function shrinkText() {
  const span = document.createElement("span");

  return function shrinkText(min, max, ...args) {
    const obj = args.pop();
    const txt = args.length === 0 ? obj.fn(this) : args[0];
    span.innerHTML = txt;

    const size = Math.max(0.6, Math.min(1, (1 - (span.innerText.length - min) / max*0.5)*1.4));
    return `<span class="point-info__span-text" style="font-size:${size}em">${txt}</span>`;
  }
}

class PointInfo extends Plugin {
  // eslint-disable-next-line
  constructor($element, info) {
    super($element);
    let $text = $element.find('.scroll-text__text');
    let text = $text.text();
    let position = 0;
    let sections;
    $(window).on('page:loaded', function(e){
      sections = e.detail.info.sections;
      changeText(text);
    })
    let $back_to_map = $element.find('.point-info__close-button');

    // $back_to_map.on('click touchend', function() {

    // })

    function changeText(text) {
      /*while ( true ) {
        let start_foundPos = text.indexOf('[', position);
        let finish_foundPos = text.indexOf(']', finish_foundPos);
        let start_array_info = text.indexOf('(', start_foundPos);
        let finish_array_info = text.indexOf(')', start_array_info);
        let array_info = text.substring(start_array_info,finish_array_info + 1).slice(1, -1);
        let link_text = text.substring(start_foundPos,finish_foundPos + 1).slice(1, -1);
        var section_index = +array_info.split('.')[0];
        var point_index = +array_info.split('.')[1];
        if (section_index) {
          link_text = '<a class="text-link" href="#point-info?id=' + sections[section_index - 1].items[point_index - 1].$id + '" data-navigo >' + link_text + '</a>';
        }
        if (start_foundPos == -1 || finish_foundPos == -1 || start_array_info == -1 || finish_array_info == -1) break;
        console.log(start_foundPos, finish_foundPos, start_array_info, finish_array_info )
        text = text.substring(0, start_foundPos) + link_text + text.substring(finish_array_info + 1)
        console.log(text.substring(0, start_foundPos))
        position = finish_array_info;
        if (start_foundPos == -1) break;
      }*/
      text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (str,text,link) => {
        const path = link.split(".");
        const section_index = path[0] - 1;
        const point_index = path[1] - 1;
        return `<a class="text-link" href="#point-info?id=${sections[section_index].items[point_index].$id}" data-navigo>${text}</a>`;
      });
      $text.html(text);
      $element.find('.text-link').on('click touchend', function() {
        var event = new CustomEvent( 'change:point-info', {detail:{id:$(this).attr('href').split('?')[1]}} );
        window.dispatchEvent(event);
      })
    }
    // console.log(text);
    // $backBtn.css({ "background-image": 'url("' + 'data/'+image+'")', "background-color": color});
  }
}

registerPlugins({
  name: "pointInfo",
  Constructor: PointInfo,
  selector: ".point-info"
});
