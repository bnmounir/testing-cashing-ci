require('dotenv').config();
require('../models/User');
const mongoose = require('mongoose');
const URI = process.env.MONGODB_URI;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
