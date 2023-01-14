const { Schema, model } = require('mongoose');

const Chat = new Schema({
    chatname: { type: String },
    avatar: { type: String },
    description: { type: String },
    members: [{ type: Object, ref: 'User' }],
    messages: { type: Array }
})

module.exports = model('Chat', Chat);