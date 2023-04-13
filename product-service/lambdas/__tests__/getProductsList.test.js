import { getProductsList } from '../getProductsList';
import { successfulResponse, badResponse } from '../../helpers/responses';
import { getPostgresClient } from '../../helpers/db';

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

describe('getProductsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call successfulResponse if products were fetched from DB', async () => {
    getPostgresClientMocked.mockReturnValueOnce({ query: () => ({ rows: [{}] }), end: jest.fn() });
    await getProductsList({});

    expect(successfulResponseMocked).toHaveBeenCalled();
    expect(badResponseMocked).not.toHaveBeenCalled();
  });

  it('should call badResponse if products were not found', async () => {
    getPostgresClientMocked.mockReturnValueOnce({ query: () => ({ rows: undefined }), end: jest.fn() });
    await getProductsList({});

    expect(badResponseMocked).toHaveBeenCalled();
    expect(successfulResponseMocked).not.toHaveBeenCalled();
  });
});
