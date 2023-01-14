let express = require('express');
const favicon = require('serve-favicon');
let app = express();
let http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;
let io = require('socket.io')(http);
let open = require('open');
let fs = require('fs')
let users = JSON.parse(fs.readFileSync('./data/users.txt').toString('utf-8'));

require('dotenv').config()

console.log(process.env.DB_LOGIN)

const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./database/authRouter');
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(express.urlencoded({
    extended: true
}));
app.use('/auth', authRouter);
app.use(express.static(path.resolve(__dirname, './')));
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', "images", 'favicon.ico')))

// console.log(users)

let userCount = 0;

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
        console.log(users)
    })

    socket.on('disconnect', function() {
        console.log('user disconected');
        userCount--;
        io.emit('getStatus', userCount)
    })
})

const start = async() => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_LOGIN}@cluster1.63rnhxo.mongodb.net/?retryWrites=true&w=majority`);
        console.log('DB conected');
    } catch (e) {
        console.log(e);
    }
}

start();

http.listen(PORT, function() {
    console.log('server runnning on port ' + PORT)
        // open('http://localhost:' + PORT)
})