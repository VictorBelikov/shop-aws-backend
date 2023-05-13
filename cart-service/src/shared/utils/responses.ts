import { headers } from '../constants/headers';
import { HttpStatus } from '@nestjs/common';

type Response = {
  statusCode: HttpStatus;
  headers: Record<string, string>;
  body: string;
};

export const successfulResponse = (
  body: Record<string, any>,
  statusCode = HttpStatus.OK,
): Response => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

export const badResponse = (
  error: Error,
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
): Response => ({
  statusCode,
  headers,
  body: JSON.stringify({
    message: error.message,
    error,
  }),
});
