const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliveryRequestSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    itemWeight: {
        type: String,
        required: true,
    },
    itemSize: {
        type: String,
        required: true,
    },
    itemDestination: {
        name: {
            type: String,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    itemPickup: {
        name: {
            type: String,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    itemTips: {
        type: String,
        required: true,
    },
    itemNotes: {
        type: String,
        required: true,
    },
    itemImage: {
        type: String,
        required: true,
    },
    submissionTime: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'delivered'],
        default: 'pending',
    },
}, { timestamps: true });

const DeliveryRequest = mongoose.model('DeliveryRequest', deliveryRequestSchema);

module.exports = DeliveryRequest;
