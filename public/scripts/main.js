let socket = io();
$('#form__emojies').fadeOut(0)

$('#form').submit(function() {
    if ($('#message_info').val().length > 0) {
        $('#form__emojies').fadeOut(300)
        socket.emit('chat message', $('#message_info').val())
        $('#message_info').val('');
    }
    return false
});

socket.on('chat message', function(data) {
    $('.messages').append('<div class="messages__item">' + data + '</div>');
    document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
})

socket.on('getStatus', function(data) {
    $('.onlineBadge__value').text(data)
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

$(document).ready(function() {
    for (moji of emoji) {
        $('.form__emoji-container').append(`<div class="form__emoji-item">${moji}</div>`)
    }
    $('.form__emoji-item').click(function() {
        $('#message_info').val($('#message_info').val() + $(this).text())
    })
});

$('.aside__menu-btn').click(function() {
    if (document.querySelector('.aside').dataset.burgerState === 'open') {
        document.querySelector('.aside').dataset.burgerState = 'close'
    } else {
        document.querySelector('.aside').dataset.burgerState = 'open'
    }
})

function generateIconPlaceholder(name, surname) {
    function pickTextColorBasedOnBgColorAdvanced(bgColor, lightColor, darkColor) {
        var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
        var r = parseInt(color.substring(0, 2), 16); // hexToR
        var g = parseInt(color.substring(2, 4), 16); // hexToG
        var b = parseInt(color.substring(4, 6), 16); // hexToB
        var uicolors = [r / 255, g / 255, b / 255];
        var c = uicolors.map((col) => {
            if (col <= 0.03928) {
                return col / 12.92;
            }
            return Math.pow((col + 0.055) / 1.055, 2.4);
        });
        var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
        return (L > 0.179) ? darkColor : lightColor;
    }
    if (name.length > 0 && surname.length > 0) {
        let obj = {
            placeholder: (name.slice(0, 1) + surname.slice(0, 1)).trim(),
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            fullName: name + ' ' + surname,
            textColor: ''
        }
        obj.textColor = pickTextColorBasedOnBgColorAdvanced(obj.color, '#ffffff', '#141414')
        return obj
    }
}

function replaceImagesWithPlaceholder() {
    let logoImages = document.querySelectorAll('img[data-src]');
    for (let i = 0; i < logoImages.length; i++) {
        if (logoImages[i].dataset.src === 'preload') {
            let placeholder = generateIconPlaceholder(logoImages[i].dataset.name, logoImages[i].dataset.surname)
            logoImages[i].style.display = 'none';
            logoImages[i].parentElement.innerHTML += `<div class="header__logo-img" style="background: ${placeholder.color}; color: ${placeholder.textColor}">${placeholder.placeholder}</div>`
        } else {
            logoImages[i].src = logoImages[i].dataset.src;
        }
    }
}

replaceImagesWithPlaceholder()