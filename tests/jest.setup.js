require('dotenv').config();
require('../models/User');
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog_ci';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
