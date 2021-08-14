const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_PREFIX, REDIS_EXPIRE } =
  process.env;
const redis = require("redis");
const { promisify } = require("util");
const prefix = `${REDIS_PREFIX}:`;

const client = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  prefix,
});

const quit = async () => {
  const quitAsync = promisify(client.quit).bind(client);
  await quitAsync();
};

const keys = async () => {
  const keysAsync = promisify(client.keys).bind(client);
  const values = await keysAsync("*");
  return values;
};

const get = async (rawKey) => {
  const key = rawKey.replace(prefix, "");
  const getAsync = promisify(client.hgetall).bind(client);
  const values = await getAsync(key);
  return values;
};

const del = async (key) => {
  const delAsync = promisify(client.del).bind(client);
  await delAsync(key);
};

const hset = async (key, values) => {
  const hsetAsync = promisify(client.hset).bind(client);
  await hsetAsync(key, values);
};

const expire = async (key, expire = REDIS_EXPIRE) => {
  const expireAsync = promisify(client.expire).bind(client);
  await expireAsync(key, expire);
};

const setKeys = async (userId, accessToken, refreshToken) => {
  const values = [
    "userId", userId,
    "accessToken", accessToken,
    "refreshToken", refreshToken,
  ];
  await hset(`${userId}`, values);
  await quit();
};

module.exports = {
  quit,
  keys,
  get,
  del,
  hset,
  expire,
  setKeys,
};
