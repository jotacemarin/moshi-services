const { mercadolibre, redis } = require("../libs");

const getKeys = async () => {
  const keys = await redis.keys();
  const users = [];
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const { userId, accessToken, refreshToken } = await redis.get(key);
    users.push({ userId, accessToken, refreshToken });
  }
  console.log(users);
  return users;
};

const refresh = async () => {
  try {
    const users = await getKeys();
    users.forEach(async element => {
      const { userId, refreshToken: currenRefreshToken } = element;
      try {
        const {
          access_token: accessToken,
          refresh_token: refreshToken,
        } = await mercadolibre.refresToken(currenRefreshToken);
        await redis.setKeys(userId, accessToken, refreshToken);
      } catch (error) {
        console.log(`refresh: ${error.message}`);
      }
    });
  } catch (error) {
    throw new Error(`refresh: ${error.message}`);
  }
};

module.exports = {
  getKeys,
  refresh,
};
