import { headers } from '../constants/headers.js';
import { STATUS_CODE } from '../constants/statusCode';

export const successfulResponse = (body, statusCode) => ({
  statusCode: statusCode || STATUS_CODE.SUCCESS,
  headers,
  body: JSON.stringify(body),
});

export const badResponse = (error) => ({
  statusCode: error.statusCode || STATUS_CODE.SERVER_ERROR,
  headers,
  body: JSON.stringify({
    message: error.message,
    error,
  }),
});
