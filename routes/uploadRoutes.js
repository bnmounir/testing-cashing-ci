const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res) => {
        console.log(req.query.type);
        const fileType = req.query.type.split('/')[1];
        const key = `${req.user.id}/${uuid()}.${fileType}`;
        s3.getSignedUrl(
            'putObject',
            {
                Bucket: 'blog-bucket-image-uploads',
                ContentType: `${req.query.type}`,
                Key: key,
                Expires: 60
            },
            (err, url) => {
                res.send({ key, url });
            }
        );
    });
};
