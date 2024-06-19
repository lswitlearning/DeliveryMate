const AcceptedRequest = require('../model/acceptedRequest.model');
const DeliveryRequest = require('../model/deliveryRequest.model');
const NotificationRequest = require('../model/notification.model')
const User = require('../model/user.model');

// Controller function to handle the creation of an accepted request
const createAcceptedRequest = async (req, res, next) => {
    try {
        const requestId = req.params.requestId;
        const acceptingUserId = req.user.id; // Assuming you have user information in req.user
        const loggedUserDetails = await User.findById(acceptingUserId)
        // Check if the request with the given ID exists
        const existingRequest = await DeliveryRequest.findById(requestId);
        if (existingRequest.userId == acceptingUserId) {
            return res.status(404).json({ message: 'Cannot accept your own request' });
        }
        if (!existingRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Check if the request has already been accepted
        const existingAcceptedRequest = await AcceptedRequest.findOne({
            requestId,
            acceptingUserId,
        });
        if (existingAcceptedRequest) {
            return res.status(400).json({ message: 'Request already accepted' });
        }
        existingRequest.status = 'accepted'
        await existingRequest.save()
        // Create a new accepted request
        const newAcceptedRequest = new AcceptedRequest({
            requestId,
            acceptingUserId,
        });


        await newAcceptedRequest.save();
        const newNotificationRequest = new NotificationRequest({
            title: 'Request Approved',
            message: `Your delivery for item ${existingRequest.itemName} is approved by ${loggedUserDetails.firstname} ${loggedUserDetails.lastname}`,
            url: '',
            userId: existingRequest.userId
        })
        await newNotificationRequest.save();
        return res.status(201).json({ message: 'Request accepted successfully!' });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

// Controller function to handle the deletion of an accepted request
const deleteAcceptedRequest = async (req, res, next) => {
    try {
        const requestId = req.params.requestId;
        const acceptingUserId = req.user.id; // Assuming you have user information in req.user
        const loggedUserDetails = await User.findById(acceptingUserId)

        // Check if the accepted request with the given ID exists
        const existingAcceptedRequest = await AcceptedRequest.findOne({
            requestId,
            acceptingUserId,
        });
        console.log(existingAcceptedRequest)
        if (!existingAcceptedRequest) {
            return res.status(404).json({ message: 'Accepted request not found' });
        }

        // Delete the accepted request
        await existingAcceptedRequest.deleteOne()
        const existingRequest = await DeliveryRequest.findById(requestId);
        existingRequest.status = 'pending'
        await existingRequest.save()
        const newNotificationRequest = new NotificationRequest({
            title: 'Request Cancelled',
            message: `Your delivery for item ${existingRequest.itemName} is cancelled by ${loggedUserDetails.firstname} ${loggedUserDetails.lastname}`,
            url: '',
            userId: existingRequest.userId
        })
        await newNotificationRequest.save();
        return res.status(200).json({ message: 'Accepted request deleted successfully!' });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
const getAllAcceptedRequests = async (req, res, next) => {
    try {
        const acceptingUserId = req.user.id; // Assuming you have user information in req.user

        // Get all accepted requests for the current user and populate user and request details
        const acceptedRequests = await AcceptedRequest.find({ acceptingUserId })
            .populate({
                path: 'acceptingUserId',
                select: 'username email',
            })
            .populate({
                path: 'requestId',
                select: 'itemName itemWeight itemSize itemDestination itemPickup itemTips itemNotes itemImage submissionTime  status',
                populate: {
                    path: 'userId',
                    select: 'firstname lastname username email', // Add user fields you want to populate for the userId field
                },
            });

        res.json({ acceptedRequests });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

module.exports = { createAcceptedRequest, deleteAcceptedRequest, getAllAcceptedRequests };
