import { STATUS_CODE } from '../constants/statusCode';

export const customError = (message, statusCode = STATUS_CODE.SERVER_ERROR) => {
  const error = new Error(message || 'Internal server error');
  error.statusCode = statusCode;
  return error;
};
