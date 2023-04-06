import { getAllProducts } from '../controllers/products.js';
import { badResponse, successfulResponse } from '../helpers/responses.js';
import { customError } from '../helpers/errorService.js';

export const getProductsList = async (event) => {
  try {
    const products = await getAllProducts();

    if (!products) {
      throw customError('Products not found', 404);
    }

    return successfulResponse(products);
  } catch (e) {
    return badResponse(e);
  }
};
