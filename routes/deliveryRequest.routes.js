const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const { submitRequest,getAllRequestsByUserId,getAllRequests,deleteRequestById,updateDeliveryStatus,getRequestById } = require('../controller/deliveryRequest.controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';
        // Create the 'uploads' directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);

    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Define routes
router.post('/submitRequest', upload.single('itemImage'), submitRequest);
router.get('/getAllRequests', getAllRequests);
router.get('/getAllRequestsByUser', getAllRequestsByUserId);
router.delete('/deleteRequest/:id', deleteRequestById);
router.put('/updateRequestDelivered/:id', updateDeliveryStatus);
router.get('/getById/:id', getRequestById);






module.exports = router;
