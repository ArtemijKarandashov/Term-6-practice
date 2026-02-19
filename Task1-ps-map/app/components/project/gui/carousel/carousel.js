/* eslint-disable */
import $ from "jquery";
import Flickity from "flickity";
import {
  registerPlugins,
  Plugin
} from "../../../framework/jquery/plugins/plugins.js";

Flickity.setJQuery($);

const PRESETS = {
  "default": {
    cellSelector: '.carousel__item',
    pageDots: false,
    prevNextButtons: false,
    fullscreen: true,
    contain: false,
    cellAlign: 'left',
    wrapAround: false,
    setGallerySize: false
  },

  "p-map": {
    setGallerySize: true,
    freeScroll: true
  },

  "free_scroll": {
    freeScroll: true,
    contain: true,
  }
};

export class Carousel extends Plugin {
  constructor($element) {
    super($element);

    let data = $element.data('carousel');
    let initialIndex = getIndex($element.data('carouselIndex'));

    if (typeof data === 'string') {
      data = PRESETS[data];
    }

    let carousel = this.carousel = new Flickity(
      $element.get(0),
      $.extend({ initialIndex }, PRESETS.default, data)
    );

    let $nav = $element.find('.carousel__nav');
    let $modal_nav = $element.find('.media-modal__nav ');

    // let $car = $('.carousel');
    // let $play_cont = $('.point-info__play-container');
    // let $play_btn = $('.point-info__play');
    // let $nav_btn = $element.find('.flickity-button');
    // let $slider = $element.find('.flickity-slider');
    // let $counter = $('.point-info__counter');
    let $item = $('.carousel__item');
    // let $flickity_v = $('.flickity-viewport');
    // if ($element.hasClass('media-modal__carousel')) {
    //   $car.css('left', '3vh');
    // } else {
    //   // $flickity_v.css('overflow', 'visible');
    // }
    if ($item.eq(0).children().length == 1 ) {
      $item.children().find('img').css('width', '63%'); 
      $modal_nav.addClass('media-modal_hide');

    }
    // if (!$element.hasClass('media-modal__carousel')) {
    //   $item.on('touchend', function(e) {
    //     let wrapper = $($($(e.target)[0].parentElement)[0].parentElement).index();
    //     let album_num = $(this).index();
    //     imageNum = wrappers_per_album * album_num + wrapper;
    //   })
    // }
    let $counter = $element.find('.carousel__counter');
    $element.toggleClass("carousel_singleframe", carousel.cells.length < 2);

    initOnChange();
    initNavButtons();

    function getIndex(id) {
      let $item = $element.find(`[data-id=${id}]`);
      if (!$item.is(".carousel__item")) {
        $item = $item.closest(".carousel__item");
      }

      return Math.max(0, $item.index());
    }
    function initNavButtons() {
      $nav.on('click',function (e) {
        e.stopPropagation();
        e.preventDefault();

        if ($(this).hasClass('carousel__nav_prev')) {
          prev();
        } else {
          next();
        }
      });
    }

    $element.on( 'dragMove.flickity', function( event, pointer, moveVector ) {
      var e = new CustomEvent( 'dragMove', {detail:{x:event.clientX}} );
      window.dispatchEvent(e);
      // console.log(event.clientX)
    });
    $element.on( 'dragEnd.flickity', function( event, pointer, moveVector ) {
      var e = new CustomEvent( 'dragEnd', {detail:{x:event.clientX}} );
      window.dispatchEvent(e);
      // console.log(event.clientX)
    });
    $element.on( 'dragStart.flickity', function( event, pointer, moveVector ) {
      var e = new CustomEvent( 'dragStart', {detail:{x:event.clientX}} );
      window.dispatchEvent(e);
      // console.log(event.clientX)
    });

    function prev(){
      carousel.previous();
    }
    function next(){
      carousel.next();
    }
    function initOnChange() {
      $element
        .on( 'change.flickity', checkCarousel);
      checkCarousel();
    }


    function checkCarousel( event, index ) {
      var e = new CustomEvent( 'slideChanged');
      window.dispatchEvent(e);
      if ( event ) event.stopPropagation();
      $nav
        .each(function () {
          let $t = $(this);
          let isInactive = $t.hasClass('carousel__nav_next') && carousel.selectedIndex === carousel.cells.length - 1
            || $t.hasClass('carousel__nav_prev') && carousel.selectedIndex === 0;
          $t.toggleClass('carousel__nav_inactive', isInactive);
        });

      $counter.text(`${carousel.selectedIndex + 1} / ${carousel.cells.length}`);
    }
  }

  reset(){
    if (this.carousel) {
      this.carousel.select(0);
    }
  }

}

registerPlugins(
  {
    'name': 'carousel',
    'Constructor': Carousel,
    'selector': '.carousel'
  }
);
