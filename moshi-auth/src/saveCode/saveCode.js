"use strict";

const { mercadolibre, redis } = require("../libs");

const htmlRespònse = (text) => `
  <html>
    <head>
      <title>Mosshi redirec</title>
      <meta http-equiv="refresh" content="2;url=https://www.mosshi.co" />
    </head>
    <body>
      <p>
        ${text}
      </p>
    </body>
  </html>
`;

const getToken = async (code) =>
  mercadolibre
    .getToken(code)
    .then((response) => {
      const {
        access_token: accessToken,
        user_id: userId,
        refresh_token: refreshToken,
      } = response;

      return {
        accessToken,
        userId,
        refreshToken,
      };
    })
    .catch(({ response }) => {
      const {
        data: { message },
      } = response;
      throw new Error(message);
    });

const saveCode = async ({ code }) => {
  let paragraph = "";

  try {
    const { accessToken, refreshToken, userId } = await getToken(code);
    await redis.setKeys(userId, accessToken, refreshToken);

    paragraph = 'Redirecting to <a href="https://www.mosshi.co">mosshi.co</a>';
  } catch (error) {
    paragraph = `${error.message}`;
  }

  return htmlRespònse(paragraph);
};

module.exports = {
  getToken,
  saveCode,
};
