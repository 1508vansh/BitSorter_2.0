const { createClient } = require('redis');

//using redis to store the blocked tokens so that other user cannot access through same token again by copying the token...
const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19046.crce286.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 19046
    }
});

module.exports = redisClient;
