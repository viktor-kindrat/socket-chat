let express = require('express');
let app = express();
let http = require('http').createServer(app);
const PORT = process.env.PORT || 3001;
let io = require('socket.io')(http);
let open = require('open')

let userCount = 0;

app.use(express.static(__dirname + '/public'));
app.get('/', function(request, response) {
    response.sendFile(__dirname + "/index.html")
})

io.on('connection', function(socket) {
    console.log('new user connect');
    userCount++;
    io.emit('getStatus', userCount)

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
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

module.exports = app;