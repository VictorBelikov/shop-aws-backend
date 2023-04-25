import { CustomError } from './customError';
import { STATUS_CODE } from '../constants/statusCode';

export const validateProductData = ({ title, description, price, count }) => {
  if (
    Number.isNaN(Number(count)) ||
    Number.isNaN(Number(price)) ||
    typeof description !== 'string' ||
    typeof title !== 'string' ||
    !description.length ||
    !title.length
  ) {
    throw CustomError('Product data is invalid', STATUS_CODE.BAD_REQUEST);
  }
};
