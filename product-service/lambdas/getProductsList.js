import { badResponse, successfulResponse } from '../utils/responses.js';
import { logIncomingRequest } from '../utils/logIncomingRequest';
import { ProductService } from '../services/ProductService';
import { DynamoDb } from '../repositories';

const productService = ProductService(DynamoDb());

export const getProductsList = async (event) => {
  logIncomingRequest(event);

  try {
    const products = await productService.getAll();
    return successfulResponse(products);
  } catch (e) {
    return badResponse(e);
  }
};
