// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB_ALz391au8yXlHF3BZA8i7CgVY-XoWXc",
    authDomain: "socketchat-6d26f.firebaseapp.com",
    projectId: "socketchat-6d26f",
    storageBucket: "socketchat-6d26f.appspot.com",
    messagingSenderId: "770663460702",
    appId: "1:770663460702:web:c8651958bc4709899ba9cf",
    measurementId: "G-9XF3TJ18H6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let nodeapp = require('express')();
let http = require('http').createServer(app);
const PORT = 3000;
let io = require('socket.io')(http);

let userCount = 0;

nodeapp.get('/', function(request, response) {
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
})