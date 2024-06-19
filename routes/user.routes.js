const express = require('express');
const router = express.Router();
const { postUser, loginUser, getUsers, getCurrentUser, changePassword, changeUserDetails, requestPasswordReset } = require('../controller/user.controller.js');
const authenticateToken = require('../utils/authenticateToken.js');

router.post('/register',
    postUser
);

router.post('/login',
    loginUser);

router.get('/allUsers', authenticateToken,
    getUsers
);
router.get('/currentUser', authenticateToken,
    getCurrentUser
);

router.post('/change-password',authenticateToken,changePassword);
router.post('/changeuserDetails',authenticateToken,changeUserDetails);
router.post('/forget-password',requestPasswordReset);


module.exports = router;