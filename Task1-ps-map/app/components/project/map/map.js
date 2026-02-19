/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable */
import "jquery.panzoom";
import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import { $window } from "../../dom";

class Map extends Plugin {
  // eslint-disable-next-line
  constructor($element) {
    super($element);
    $element.find(".panzoom-elements").panzoom();
    const $container = $element.find(".map__container");
    const $zoom = $element.find('.map__zoom-area');
    // const $page = $(".custom-page");
    const blockWidth = parseInt(
      $element.find(".map-point__block").css("width")
    );
    const point_height = '181px';
    const section = $container;

    $element.on("click", ".map-point_group", function onGroupClick() {
      this.classList.add("map-point_active");
    });
    $window.on("click", onClickOutside);
    this.__destroy.push(() => {
      $window.off("click", onClickOutside);
    });

    this.findNearestPoints = findNearestPoints;

    function onClickOutside({target}) {
      $element.find(".map-point_active").each((i, itm) => {
        if (!itm.contains(target)) {
          itm.classList.remove("map-point_active");
        }
      });
    }

    function findNearestPoints($points) {
      // const pointWidth = $points.eq(0).css("width");

      const rects = $points
        .map((i, itm) => ({items: [itm], rect: new Rect(itm.getBoundingClientRect())}))
        .get()
        .sort(({rect:i1}, {rect:i2}) => {
          const dx = i1.right - i2.right;
          return Math.abs(dx) > 1 ? dx : i1.bottom - i2.bottom;
        });
      for (let i = 0; i < rects.length; i++){
        for (let j = i + 1; j < rects.length; j++) {
          if (rects[i].rect.isIntersects(rects[j].rect)) {
            rects[i].items.push(...rects[j].items);
            rects[i].rect.top -= rects[j].rect.height;
            rects[i].rect.left -= Math.max(0, rects[j].rect.width - rects[i].rect.width);
            rects[i].rect.width = Math.max(rects[i].rect.width, rects[j].rect.width);
            rects[i].rect.height = Math.max(rects[i].rect.height, rects[j].rect.height);
            rects.splice(j--, 1);
          }
        }
      }

      const tpl = $element.find(".map__group-tpl");
      rects.forEach(({items}) => {
        if (items.length > 1) {
          const $group = tpl.templateEngine({count: items.length}, {append: false});
          $group.insertAfter(items[0]);
          $group.css({
            left: items[0].style.left,
            top: items[0].style.top
          });
          $group.get(0).style.setProperty("--color", items[0].style.getPropertyValue("--color"));
          $group.find(".map-point__group-cont")
            .append(...items.map(node => {
              // if (node.parentNode) {
              //   node.parentNode.removeChild(node);
              // }
              return node;//.querySelector(".map-point__content");
            }));
        }
      })

      /*for (let i = 0; i < $points.length; i += 1) {
        const curPoint = $points.eq(i);
        const curPointLeft = parseInt(curPoint.css("left"));
        const curPointTop = parseInt(curPoint.css("top"));
        let counter = 0;
        let nearest_points = [];
        let isElementLower = false;
        for (let j = i + 1; j < $points.length; j += 1) {
          const comparedPoint = $points.eq(j);
          const comparedLeft = parseInt(comparedPoint.css("left"));
          const comparedTop = parseInt(comparedPoint.css("top"));
          if (
            Math.abs(curPointLeft - comparedLeft) < parseInt(pointWidth) &&
            Math.abs(curPointTop - comparedTop) < parseInt(point_height) &&
            counter < 2 && curPoint[0].search != comparedPoint[0].search
          ) {
              if (curPointLeft > comparedLeft) {
                if ($('.map__bg').width() - blockWidth <= curPointLeft) isElementLower = true;
                curPoint.css(
                  "left",
                  curPointLeft + parseInt(pointWidth) - blockWidth
                );
                if ( Math.abs(curPointTop - comparedTop) < parseInt(point_height) &&  Math.abs(curPointLeft - comparedLeft) < parseInt(blockWidth)) {
                  isElementLower = true;
                }
              }
              nearest_points.push(comparedPoint);
              counter += 1;
          }

          if ( j+2 >= $points.length && (counter > 1 || isElementLower)) {
            let $newgroup = $( "<div class='map__group'></div>" );
            let $cont = $( "<div class='map__group-cont'></div>" );
            let $group_block = $( "<div class='map__group-block'></div>" );
            $newgroup.css({'left': curPointLeft, 'top': curPointTop});
            $group_block.css({'left': curPointLeft, 'top': curPointTop});
            $newgroup.text(nearest_points.length + 1);
            $newgroup.append($cont);
            $cont.css('display', 'none');

            // $newgroup.append(nearest_points[k]);
            for ( let k = 0; k < nearest_points.length; k+=1 ) {
              nearest_points[k].next().remove();
              nearest_points[k].remove();
              $cont.append(nearest_points[k]);
            }
            curPoint.next().remove();
            curPoint.remove();
            $cont.append(curPoint);
            let children = $cont.children();
            for ( let k = 0; k < children.length; k+=1 ) {
              let link = children.eq(k);
              setTimeout(function(){link.css({'top': k * parseInt(point_height), 'left': '488px','color': 'black', 'margin-top': 0});}, 100);
            }
            $zoom.append($newgroup);
            $zoom.append($group_block);

            TweenLite.to($newgroup[0], 0.7, { delay: 0.5, ease: Back.easeOut.config(1.7), transform: 'scale(1) rotate(5deg)'});
            TweenLite.to($group_block[0], 0.7, {delay: 0.8, transform: 'scale(1) rotate(20deg)'});
            TweenLite.to($newgroup[0], 0.7, { delay: 1, ease: Back.easeOut.config(1.7), transform: 'rotate(0deg)'});
            TweenLite.to($group_block[0], 0.7, { delay: 1, ease: Back.easeOut.config(1.7), transform: 'rotate(0deg)'});
              

            $newgroup
            // .on('click', function() {$cont.css({"display": 'block'});})
            .on('touchstart', function(e) { 
              TweenLite.to($cont[0], 0.7, {delay: 0.4, width: '25.7vh', marginLeft: 0});
              setTimeout(function(){ $cont.css({"display": 'block'}) }, 200)
          })
            .on('touchmove', function(e) { $cont.css({"display": 'block'}) });

            $zoom
<<<<<<< HEAD
            .on('touchend', function(e) { 
              if(! ($(e.target).hasClass('map-point') || $(e.target).hasClass('map__group') || $(e.target).hasClass('map-point__subtitle') || $(e.target).hasClass('map-point__title')))  {
                TweenLite.to($cont[0], 0.7, { width: 0, marginLeft: '25.7vh'});
                console.log(e.target)

                // $('.map__group-cont').css({"display": 'none'});
=======
            .on('touchend', function(e) {
              if(! ($(e.target).hasClass('map-point') || $(e.target).hasClass('map-point__subtitle') || $(e.target).hasClass('map-point__title')))  {
                $('.map__group-cont').css({"display": 'none'});
>>>>>>> a0566c616c2a30e7f2aa16bf77975745b3a311a2
              }
            })
          }
        }
      }*/
    }
    const panzoom = section.find(".map__zoom-area").panzoom({
      increment: 0.07,
      duration: 500,
      panOnlyWhenZoomed: true,
      contain: "invert", // "invert",
      disablePan: true,
      minScale: 1,
      maxScale: 5
    });

    section.on("mousewheel", e => {
      e.preventDefault();
      panzoom.panzoom("zoom", e.originalEvent.wheelDelta < 0, {
        increment: 0.1,
        focal: e
      });
    });

    section
    .on('touchstart', function(){$zoom.panzoom("option", {disablePan: true})})
    .on('touchmove', function(){ $zoom.panzoom("option", {disablePan: false})})
    .on('touchend', function(){ $zoom.panzoom("option", {disablePan: true});})

  }
}

class Rect {
  x;

  y;

  width;

  height;

  left;

  right;

  top;

  bottom;

  constructor(rect) {
    this.left = this.x = rect.x || rect.left;
    this.top = this.y = rect.y || rect.top;
    this.width = rect.width;
    this.height = rect.height;
    this.right = rect.right;
    this.bottom = rect.bottom;
  }

  isIntersects(r) {
    return !(
      r.left > this.right ||
      this.left > r.right ||
      r.top > this.bottom ||
      this.top > r.bottom
    );
  }
}


registerPlugins({
  name: "map",
  Constructor: Map,
  selector: ".map"
});
