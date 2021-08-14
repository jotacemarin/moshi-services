"use strict";

const {
  MERCADOLIBRE_URL,
  MERCADOLIBRE_CLIENT_ID,
  MERCADOLIBRE_CLIENT_SECRET,
  MERCADOLIBRE_REDIRECT,
} = process.env;
const axios = require("axios");

const mercadolibreAPI = axios.create({ baseURL: MERCADOLIBRE_URL });

const refresToken = async (refreshToken) => {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("client_id", MERCADOLIBRE_CLIENT_ID);
  params.append("client_secret", MERCADOLIBRE_CLIENT_SECRET);
  params.append("refresh_token", refreshToken);

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const options = { headers };

  const { data: response } = await mercadolibreAPI.post(
    "/oauth/token",
    params,
    options
  );
  return response;
};

const getToken = async (code) => {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", MERCADOLIBRE_CLIENT_ID);
  params.append("client_secret", MERCADOLIBRE_CLIENT_SECRET);
  params.append("code", code);
  params.append("redirect_uri", MERCADOLIBRE_REDIRECT);

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const options = { headers };

  const { data: response } = await mercadolibreAPI.post(
    "/oauth/token",
    params,
    options
  );
  return response;
};

module.exports = {
  refresToken,
  getToken,
};
