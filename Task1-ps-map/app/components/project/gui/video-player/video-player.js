/* eslint-disable */
import $ from 'jquery';
import {
  registerPlugins,
  Plugin
} from "../../../framework/jquery/plugins/plugins";

import TemplateEngine from "../../../framework/template-engine/template-engine";
TemplateEngine.registerHelper("is_video", function isVideo(cond, obj) {
  if (arguments.length === 1) {
    obj = cond;
    cond = this;
  }
  return cond.video ? obj.fn(this) : obj.inverse(this);
});


class VideoPlayer extends Plugin {
  // eslint-disable-next-line
  constructor($element) {
    super($element);
    const video = $element.find("video")[0];
    const $pause_btn =$element.find(".video-player__play-container");
    const $icon = $element.find(".video-player__play");
    const $btn = $element.find(".video-player__button");
    const $next = $(".media-modal__nav_next");
    const $prev = $(".media-modal__nav_prev");
    const $close_btn = $('.custom-modal__close-btn');
    const play_bg = "./images/play.svg";
    const pause_bg = "./images/pause.svg";

    if ( !video ) return;
    // $element.on('', playPauseVideo)
    $next.on('click touchend', function() {
      video.pause();
      // if ( video.currentTime != 0 ) video.currentTime = 0;
      video.load();
      $pause_btn.css({'opacity': 1})
      $icon.css({'background-image':'url(' + play_bg + ')', 'left': '53%'});
    })

    $prev.on('click touchend', function() {
      video.pause();;
      video.load();
      $pause_btn.css({'opacity': 1})
      $icon.css({'background-image':'url(' + play_bg + ')', 'left': '53%'});
    })

    $pause_btn
      .on("click touchend", playPauseVideo);

    $close_btn.on("click touchend", function(){
      var event = new CustomEvent( 'video_paused' );
      window.dispatchEvent(event);
    })
    let is_swiped = false;
    $(window)
      .on("slideChanged", function(e, detail) {
        video.load();
        $pause_btn.css({'opacity': 1})
        $icon.css({'background-image':'url(' + play_bg + ')', 'left': '53%'});
        is_swiped = true;
      })

    $(video)
     .on("ended", () => {
      var event = new CustomEvent( 'video_paused' );
      window.dispatchEvent(event);
      video.pause();
      video.load();
      $icon.css({'background-image':'url(' + play_bg + ')', 'left': '53%'});
      $pause_btn.css({'opacity': 1})
    })
    .on('click touchend', function() {
      if ( is_swiped ) {
        is_swiped = false;
      } else {
        playPauseVideo();

      }
    });

    function playPauseVideo(e) {
      if (video.paused) {
        var event = new CustomEvent( 'video_playing' );
        window.dispatchEvent(event);
        video.play();
        $icon.css({'background-image':'url(' + pause_bg + ')', 'left': '50%'});
        setTimeout(function(){if (!video.paused) $pause_btn.animate({'opacity': 0}, 200)}, 1000);
      }
      else {
        var event = new CustomEvent( 'video_paused' );
        window.dispatchEvent(event);
        video.pause();
        $pause_btn.animate({'opacity': 1})
        $icon.css({'background-image':'url(' + play_bg + ')', 'left': '53%'});
      }
    }
    // $pause_btn.css('background-size', '120px');
  }
}

registerPlugins({
  name: "videoPlayer",
  Constructor: VideoPlayer,
  selector: ".video-player"
});
