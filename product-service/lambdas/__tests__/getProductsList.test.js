import { getAllProducts } from '../../controllers/products';
import { getProductsList } from '../getProductsList';
import { successfulResponse, badResponse } from '../../helpers/responses';

jest.mock('../../controllers/products', () => ({
  getAllProducts: jest.fn(),
}));

jest.mock('../../helpers/responses', () => ({
  successfulResponse: jest.fn(),
  badResponse: jest.fn(),
}));

const getAllProductsMocked = jest.mocked(getAllProducts);
const successfulResponseMocked = jest.mocked(successfulResponse);
const badResponseMocked = jest.mocked(badResponse);

describe('getProductsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call successfulResponse if products were fetched from DB', async () => {
    getAllProductsMocked.mockReturnValueOnce({});
    await getProductsList();

    expect(getAllProductsMocked).toHaveBeenCalled();
    expect(successfulResponseMocked).toHaveBeenCalled();
    expect(badResponseMocked).not.toHaveBeenCalled();
  });

  it('should call badResponse if products were not found', async () => {
    getAllProductsMocked.mockReturnValueOnce(undefined);
    await getProductsList();

    expect(getAllProductsMocked).toHaveBeenCalled();
    expect(badResponseMocked).toHaveBeenCalled();
    expect(successfulResponseMocked).not.toHaveBeenCalled();
  });
});
