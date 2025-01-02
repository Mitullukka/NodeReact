import Redis from 'ioredis';

const config = require('config')

const RedisClient = new Redis(Number(config.get("REDIS_PORT")),config.get("REDIS_HOST"));

export default RedisClient