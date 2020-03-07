require('dotenv').config();
require('../models/User');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
