import { getSpecificProduct } from '../../controllers/products';
import { getProductById } from '../getProductById';
import { successfulResponse, badResponse } from '../../helpers/responses';

jest.mock('../../controllers/products', () => ({
  getSpecificProduct: jest.fn(),
}));

jest.mock('../../helpers/responses', () => ({
  successfulResponse: jest.fn(),
  badResponse: jest.fn(),
}));

const getSpecificProductMocked = jest.mocked(getSpecificProduct);
const successfulResponseMocked = jest.mocked(successfulResponse);
const badResponseMocked = jest.mocked(badResponse);

describe('getProductById', () => {
  const mockedEvent = {
    pathParameters: {
      productId: '777',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call successfulResponse if products were fetched from DB', async () => {
    getSpecificProductMocked.mockReturnValueOnce({});
    await getProductById(mockedEvent);

    expect(getSpecificProductMocked).toHaveBeenCalled();
    expect(successfulResponseMocked).toHaveBeenCalled();
    expect(badResponseMocked).not.toHaveBeenCalled();
  });

  it('should call badResponse if products were not found', async () => {
    getSpecificProductMocked.mockReturnValueOnce(undefined);
    await getProductById(mockedEvent);

    expect(getSpecificProductMocked).toHaveBeenCalled();
    expect(badResponseMocked).toHaveBeenCalled();
    expect(successfulResponseMocked).not.toHaveBeenCalled();
  });
});
