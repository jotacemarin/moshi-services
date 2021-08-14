"use strict";

const lodash = require("lodash");
const httpStatus = require("http-status");

const services = require("./src");

const createResponse = (statusCode, response = null) => {
  const payload = {
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
  };

  if (response) payload.body = JSON.stringify(response);

  return payload;
};

const refresh = async (_event, _context, callback) => {
  try {
    await services.refresh();
  } catch (error) {
    const { message } = error;
    return callback(
      null,
      createResponse(httpStatus.INTERNAL_SERVER_ERROR, { error: message })
    );
  }
};

const saveCode = async (event, context, callback) => {
  const { queryStringParameters } = event;

  if (lodash.isEmpty(queryStringParameters)) {
    return callback(null, createResponse(httpStatus.BAD_REQUEST));
  }

  const result = await services.saveCode(queryStringParameters);
  console.log(result);

  return context.succeed(result);
};

module.exports = {
  refresh,
  saveCode,
};
