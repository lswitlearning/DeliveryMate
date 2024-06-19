const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    url: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user', // Assuming there is a User model
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
