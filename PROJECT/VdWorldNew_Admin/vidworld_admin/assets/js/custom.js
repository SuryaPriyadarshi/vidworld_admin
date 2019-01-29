$(function () {
    $(document).on('click', '.p-active-toggle > li', function () {
        $(this).addClass('m-menu__item--active').siblings().removeClass('m-menu__item--active');
    });

    $(document).on('click', '.m-nav > li', function () {
        $(this).addClass('m-nav__item--active').siblings().removeClass('m-nav__item--active');
    })

});


 $('.video-thumb').on('click', function (ev) {
        var video_src = $("#youtube-video")[0].src;
        var new_src = video_src.replace('autoplay=0', '');
        new_src += "&autoplay=1";
        $("#youtube-video")[0].src = new_src;
        ev.preventDefault();
});
