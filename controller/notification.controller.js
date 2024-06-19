const NotificationSchema = require('../model/notification.model')

async function getAllNotifications(req, res, next) {
    try {
        const userId = req.user.id;
        const notifications = await NotificationSchema.find({ userId })
        res.json({ notifications })
    }
    catch (error) {
        console.error(error);
        return next(error);
    }
}

module.exports = { getAllNotifications }