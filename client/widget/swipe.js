Template.swipe_banners.onRendered(function(){
  var autoSwiper = new Swiper ('.swiper-container', {
    loop:true,
    autoHeight: true,
    pagination : '.swiper-pagination',
    autoplay: 6000,
    effect : 'fade',
    fade: {
      crossFade: false,
    }
  });
});
