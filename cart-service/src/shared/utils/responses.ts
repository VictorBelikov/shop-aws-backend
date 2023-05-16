import { headers } from '../constants/headers';
import { HttpStatus } from '@nestjs/common';

type Response = {
  statusCode: HttpStatus;
  headers: Record<string, string>;
  message: string;
  body: string;
};

export const successfulResponse = (
  body: Record<string, any> = {},
  message = 'OK',
  statusCode = HttpStatus.OK,
): Response => ({
  statusCode,
  message,
  headers,
  body: JSON.stringify(body),
});

export const badResponse = (error: Error, statusCode = HttpStatus.INTERNAL_SERVER_ERROR): Response => ({
  statusCode,
  message: error.message,
  headers,
  body: JSON.stringify({
    error,
  }),
});
