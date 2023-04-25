import { successfulResponse, badResponse } from '../utils/responses.js';
import { logIncomingRequest } from '../utils/logIncomingRequest';
import { ProductService } from '../services/ProductService';
import { DynamoDb } from '../repositories';

const productService = ProductService(DynamoDb());

export const getProductById = async (event) => {
  logIncomingRequest(event);

  try {
    const { productId } = event.pathParameters;
    const product = await productService.getById(productId);
    return successfulResponse(product);
  } catch (e) {
    return badResponse(e);
  }
};
