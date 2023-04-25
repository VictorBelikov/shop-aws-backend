import { successfulResponse, badResponse } from '../../utils/responses';
import { ProductService } from '../../services/ProductService';
import { catalogBatchProcess } from '../catalogBatchProcess';
import { faker } from '@faker-js/faker';

jest.mock('../../utils/responses', () => ({
  successfulResponse: jest.fn(),
  badResponse: jest.fn(),
}));

jest.mock('../../services/ProductService', () => ({
  ProductService: jest.fn().mockReturnValue({ createBatch: jest.fn() }),
}));

jest.mock('../../repositories');

const successfulResponseMocked = jest.mocked(successfulResponse);
const badResponseMocked = jest.mocked(badResponse);
const ProductServiceMocked = jest.mocked(ProductService);

describe('catalogBatchProcess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockedProduct = {
    id: faker.datatype.uuid(),
    title: faker.datatype.string(),
    description: faker.datatype.string(),
    price: faker.datatype.number(),
  };

  const mockedRecords = [mockedProduct];

  const mockedEvent = {
    Records: mockedRecords,
  };

  it('should should call createBatch in product service', async () => {
    await catalogBatchProcess(mockedEvent);

    expect(ProductServiceMocked().createBatch).toHaveBeenCalledWith(mockedRecords);
    expect(successfulResponseMocked).toHaveBeenCalled();
    expect(badResponseMocked).not.toHaveBeenCalled();
  });

  it('should badResponse if incorrect event object was passed', async () => {
    await catalogBatchProcess();

    expect(ProductServiceMocked().createBatch).not.toHaveBeenCalled();
    expect(successfulResponseMocked).not.toHaveBeenCalled();
    expect(badResponseMocked).toHaveBeenCalled();
  });
});
