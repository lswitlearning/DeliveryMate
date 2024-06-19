const express = require('express');
const { getAllNotifications } = require('../controller/notification.controller');

const router = express.Router();
//get all accepted request
router.get('/', getAllNotifications)
// Create an accepted request


module.exports = router;