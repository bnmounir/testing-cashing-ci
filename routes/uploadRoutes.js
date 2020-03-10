const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res) => {
        if (!req.query.type) {
            res.status(422).json({
                error: 'you must provide a image to get a signed url!'
            });
        }
        console.log(req.query.type);
        const fileReceived = req.query.type.split('/');
        const fileType = fileReceived[0];
        const fileExt = fileReceived[1];
        if (fileType !== 'image')
            return res.status(401).json({ error: 'only images are allowed' });
        const key = `${req.user.id}/${uuidv4()}.${fileExt}`;
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
