let socket = io();
socket.on('chat message', function(data) {
    let catchedData = JSON.parse(data);
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let avatar = catchedData.avatar;
    console.log(avatar)
    if (catchedData.username === currentUser.username) {
        $('.messages').append(`<div class="messages__item" style="flex-direction: row-reverse;"><div class="message__avatar" style="background: ${avatar.color}; color: ${avatar.textColor}">${avatar.placeholder}</div><div class="message__text" style="border-radius: 10px 0 10px 10px;"><span class="message__name" style="color: ${avatar.color}">${catchedData.name} ${catchedData.surname}</span> <span class="message__message">${catchedData.message}</span></div></div>`);
    } else {
        $('.messages').append(`<div class="messages__item"><div class="message__avatar" style="background: ${avatar.color}; color: ${avatar.textColor}">${avatar.placeholder}</div><div class="message__text" style="border-radius: 0 10px 10px 10px;"><span class="message__name" style="color: ${avatar.color}">${catchedData.name} ${catchedData.surname}</span> <span class="message__message">${catchedData.message}</span></div></div>`);
    }
    document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
})

socket.on('registration status', function(data) {
    let serverdata = JSON.parse(data)
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (serverdata.key === currentUser.key) {
        if (serverdata.status === "Success") {
            loginsatus = 'logined';
            localStorage.setItem('loginsatus', loginsatus)
            $('.start').fadeOut(300)
        } else {
            alert(`Server returned: ${serverdata.status}`)
        }
    }
})

socket.on('getStatus', function(data) {
    $('.onlineBadge__value').text(data)
})

// event listeners

$('#form').submit(function() {
    if ($('#message_info').val().length > 0) {
        $('#form__emojies').fadeOut(300)
        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        socket.emit('chat message', JSON.stringify({
            username: currentUser.username,
            name: currentUser.name,
            surname: currentUser.surname,
            avatar: currentUser.avatar,
            message: $('#message_info').val()
        }))
        $('#message_info').val('');
        $('#message_info').blur();
    }
    return false
});

$('#register').submit(function() {
    let name = $('#register-name').val();
    let surname = $('#register-surname').val() || ' ';
    let username = $('#register-username').val();
    let userpassword = $('#register-password').val();
    if (name.length > 0 && username.length > 0 && userpassword.length > 0) {
        let validation = passwordValidate(userpassword);
        if (validation.length === 0) {
            let user = {
                'name': name,
                'surname': surname,
                'username': username,
                'password': userpassword,
                'key': Date.now()
            }
            user.avatar = generateIconPlaceholder(user.name, user.surname || ' ')
            console.log(user)
            localStorage.setItem('currentUser', JSON.stringify(user))
            socket.emit('new user', JSON.stringify(user))
        } else {
            let text = ``
            for (item of validation) {
                text += '- ' + item + '\n'
            }
            $('.start__status').html(text);
            $('.start__status').fadeIn(300)
        }
    } else {
        alert('Dont lie!');
    }
    return false
})