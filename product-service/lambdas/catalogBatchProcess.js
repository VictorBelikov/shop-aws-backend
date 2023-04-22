import { badResponse, successfulResponse } from '../utils/responses';
import { STATUS_CODE } from '../constants/statusCode';
import { ProductService } from '../services/ProductService';
import { DynamoDb } from '../repositories';

const productService = ProductService(DynamoDb());

export const catalogBatchProcess = async (event) => {
  try {
    const products = await productService.createBatch(event.Records);
    return successfulResponse(products, STATUS_CODE.CREATED);
  } catch (e) {
    return badResponse(e);
  }
};
