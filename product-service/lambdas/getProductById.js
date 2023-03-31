import { getSpecificProduct } from '../controllers/products.js';
import { successfulResponse, badResponse } from '../helpers/responses.js';
import { customError } from '../helpers/errorService.js';

export const getProductById = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = await getSpecificProduct(productId);

    if (!product) {
      throw customError('Product not found', 404);
    }

    return successfulResponse(product);
  } catch (e) {
    return badResponse(e);
  }
};
