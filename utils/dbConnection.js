const mongoose = require('mongoose');
const dotenv = require('dotenv');
const mongoUrl = process.env.MONGODB_URL;

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Connected to database`)
}).catch((err) => {
    console.log('Error---->',err)
});

