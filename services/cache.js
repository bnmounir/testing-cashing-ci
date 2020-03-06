require('dotenv').config();
const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = process.env.REDIS_URL;
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
};

mongoose.Query.prototype.exec = async function() {
    if (!this.useCache) {
        console.log('not using cache!');
        return exec.apply(this, arguments);
    }
    console.log('using cache!');
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );
    const cacheValue = await client.hget(this.hashKey, key);

    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }
    const res = await exec.apply(this, arguments);

    client.hset(this.hashKey, key, JSON.stringify(res), 'EX', 120);

    return res;
};

module.exports = {
    clearCache(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};
