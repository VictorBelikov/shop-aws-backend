import { getProductById } from '../getProductById';
import { successfulResponse, badResponse } from '../../utils/responses';
import { getPostgresClient } from '../../repositories/DynamoDB/helpers/getDynamodbClient';

jest.mock('../../helpers/responses', () => ({
  successfulResponse: jest.fn(),
  badResponse: jest.fn(),
}));

jest.mock('../../helpers/db', () => ({
  getPostgresClient: jest.fn(),
}));

const successfulResponseMocked = jest.mocked(successfulResponse);
const badResponseMocked = jest.mocked(badResponse);
const getPostgresClientMocked = jest.mocked(getPostgresClient);

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
    getPostgresClientMocked.mockReturnValueOnce({ query: () => ({ rows: [{}] }), end: jest.fn() });
    await getProductById(mockedEvent);

    expect(successfulResponseMocked).toHaveBeenCalled();
    expect(badResponseMocked).not.toHaveBeenCalled();
  });

  it('should call badResponse if products were not found', async () => {
    getPostgresClientMocked.mockReturnValueOnce({ query: () => ({ rows: [undefined] }), end: jest.fn() });
    await getProductById(mockedEvent);

    expect(badResponseMocked).toHaveBeenCalled();
    expect(successfulResponseMocked).not.toHaveBeenCalled();
  });
});
