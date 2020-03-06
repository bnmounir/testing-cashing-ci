require('dotenv').config();
const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const key = process.env.COOKIE_KEY;
const keygrip = new Keygrip([key]);

module.exports = user => {
    const sessionObject = { passport: { user: user._id.toString() } };
    const session = Buffer.from(JSON.stringify(sessionObject)).toString(
        'base64'
    );
    const sig = keygrip.sign('session=' + session);
    return { session, sig };
};
