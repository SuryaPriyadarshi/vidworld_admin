function check_height() {
    var window_height = $(window).outerHeight();
    var wrapper_height = $('.wrapper').outerHeight();

    if (window_height > wrapper_height) {
        $('body').addClass('footer-fixed');
    } else {
        $('body').removeClass('footer-fixed');
    }
}
$(document).ready(function () {
    $(document).on("click", ".close", function () {
        $(this).parent('.products').remove();
        event.preventDefault;
    });
    var window_width = $(window).outerWidth();
    if (window_width >= 640) {
        check_height();
    }
});
$(window).on('resize', function () {
    var window_width = $(window).outerWidth();
    if (window_width >= 640) {
        check_height();
    }
});
