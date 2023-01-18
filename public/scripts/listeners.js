$(document).ready(function() {
    for (moji of emoji) {
        $('.form__emoji-container').append(`<div class="form__emoji-item">${moji}</div>`)
    }
    $('.form__emoji-item').click(function() {
        $('#message_info').val($('#message_info').val() + $(this).text())
    })
});

$('#start__answer-yes').click(function() {
    $('.start__first').fadeOut(150);
    setTimeout(() => {
        $('.start__register').fadeIn(300);
        $('.start__register').css('display', 'flex');
    }, 150);
});

$('#aside__logout').click(function() {
    let confirmation = confirm('Are you sure?')
    if (confirmation) {
        localStorage.clear();
        window.location.reload();
    } else {
        alert('Canceled')
    }
})

$('#form__emoji').mouseenter(function() {
    let elStyles = window.getComputedStyle(document.querySelector('#form__emojies'))
    $('#form__emojies').fadeIn(300)
    $('#form__emojies').css({
        'display': 'flex',
        'bottom': '125px',
        'left': (document.querySelector('#form__emoji').offsetLeft + 50) - (Number(elStyles.width.slice(0, elStyles.width.lastIndexOf('px'))) / 2) + 'px'
    })
    console.log(document.querySelector('#form__emoji').offsetTop)
})

$('#form__emoji').click(function() {
    $('#form__emojies').fadeOut(300)
})

$('#form__emojies').mouseenter(function() {
    emojiesMouseEntered = true
})
$('#form__emojies').mouseleave(function() {
    emojiesMouseEntered = false
})

$('.messages').mouseenter(function() {
    let x = setTimeout(() => {
        if (emojiesMouseEntered) {
            clearTimeout(x)
        } else {
            $('#form__emoji').click();
        }
    }, 1000);
})


$('.aside__menu-btn').click(function() {
    if (document.querySelector('.aside').dataset.burgerState === 'open') {
        document.querySelector('.aside').dataset.burgerState = 'close'
    } else {
        document.querySelector('.aside').dataset.burgerState = 'open'
    }
})