const express = require('express');
const router = express.Router();
const { createAcceptedRequest, deleteAcceptedRequest, getAllAcceptedRequests } = require('../controller/acceptedRequest.controller');
//get all accepted request
router.get('/', getAllAcceptedRequests)
// Create an accepted request
router.post('/:requestId', createAcceptedRequest);

// Delete an accepted request
router.delete('/:requestId', deleteAcceptedRequest);

module.exports = router;
