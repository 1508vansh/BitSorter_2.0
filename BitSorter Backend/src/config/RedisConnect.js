const { createClient } = require('redis');

//using redis to store the blocked tokens so that other user cannot access through same token again by copying the token...
const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-11478.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 11478
    }
});

module.exports = redisClient;
