$(".wrap").fadeOut(0)

$(document).ready(function() {
    setTimeout(() => {
        $(".preloader").fadeOut(300);
        $(".wrap").fadeIn(300)
    }, 600)
});