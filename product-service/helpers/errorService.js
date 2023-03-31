export const customError = (message, statusCode = 500) => {
  const error = new Error(message || 'Internal server error');
  error.statusCode = statusCode;
  return error;
};
