import { successfulResponse, badResponse } from '../utils/responses.js';
import { logIncomingRequest } from '../utils/logIncomingRequest';
import { STATUS_CODE } from '../constants/statusCode';
import { ProductService } from '../services/ProductService';
import { DynamoDb } from '../repositories';

const productService = ProductService(DynamoDb());

export const createProduct = async (event) => {
  logIncomingRequest(event);

  try {
    const product = JSON.parse(event.body);
    const productId = await productService.create(product);
    return successfulResponse({ message: `product with id: ${productId} successfully created` }, STATUS_CODE.CREATED);
  } catch (e) {
    return badResponse(e);
  }
};
