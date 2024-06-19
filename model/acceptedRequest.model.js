const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const acceptedRequestSchema = new mongoose.Schema({
    requestId: {
        type: Schema.Types.ObjectId,
        ref: 'DeliveryRequest',
        required: true,
    },
    acceptingUserId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
}, { timestamps: true });

const AcceptedRequest = mongoose.model('AcceptedRequest', acceptedRequestSchema);

module.exports = AcceptedRequest;
