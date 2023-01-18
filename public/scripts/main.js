let loginsatus = localStorage.getItem('loginsatus') || '';
let emojiesMouseEntered = false;

let passwordValidate = (password) => {
    let problems = [];
    if (password.length < 8) {
        problems.push('Password must contain more than 8 symbols!')
    }
    if (new RegExp(' ', 'gi').test(password)) {
        problems.push('Password cant contain spaces')
    }
    if (new RegExp('qwerty', 'gi').test(password)) {
        problems.push('Password cant contain "qwerty" word')
    }
    return problems
}

let pickTextColorBasedOnBgColorAdvanced = (bgColor, lightColor, darkColor) => {
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

let generateIconPlaceholder = (name, surname) => {
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
$('#form__emojies').fadeOut(0)
loginsatus === 'logined' ? $('.start').fadeOut(0) : false