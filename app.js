let express = require('express');
let app = express();
let http = require('http').createServer(app);
const PORT = process.env.PORT || 3001;
let io = require('socket.io')(http);
let open = require('open');
let fs = require('fs')
let users = JSON.parse(fs.readFileSync('./data/users.txt').toString('utf-8'));
console.log(users)

let userCount = 0;

app.use(express.static(__dirname + '/public'));
app.get('/', function(request, response) {
    response.sendFile(__dirname + "/index.html")
})

io.on('connection', function(socket) {
    console.log('new user connect');
    userCount++;
    io.emit('getStatus', userCount)

    socket.on('chat message', function(data) {
        io.emit('chat message', data);
    })

    socket.on('new user', function(data) {
        let user = JSON.parse(data);
        let userFounded = false;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === user.username) {
                userFounded = true;
            }
        }
        if (userFounded) {
            io.emit('registration status', JSON.stringify({
                status: 'Username taken',
                key: user.key
            }))
        } else {
            users.push(user);
            fs.writeFileSync('./data/users.txt', JSON.stringify(users))
            io.emit('registration status', JSON.stringify({
                status: 'Success',
                key: user.key
            }))
            console.log('user ' + user.key + ' registered')
        }
    })

    socket.on('disconnect', function() {
        console.log('user disconected');
        userCount--;
        io.emit('getStatus', userCount)
    })
})

http.listen(PORT, function() {
    console.log('server runnning on port ' + PORT)
    open('http://localhost:' + PORT)
})