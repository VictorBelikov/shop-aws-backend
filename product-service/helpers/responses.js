import { headers } from '../constants/headers.js';

export const successfulResponse = (body) => ({
  statusCode: 200,
  headers,
  body: JSON.stringify(body),
});

export const badResponse = (error) => ({
  statusCode: error.statusCode || 500,
  headers,
  body: JSON.stringify({
    message: error.message,
    error,
  }),
});
