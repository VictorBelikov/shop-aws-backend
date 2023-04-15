import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { faker } from '@faker-js/faker';
import { importProductsFile } from '../importProductsFile';
import { badResponse, successfulResponse } from '../../helpers/responses';

jest.mock('../../helpers/responses', () => ({
  successfulResponse: jest.fn(),
  badResponse: jest.fn(),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  ...jest.requireActual('@aws-sdk/s3-request-presigner'),
  getSignedUrl: jest.fn(),
}));

const successfulResponseMocked = jest.mocked(successfulResponse);
const badResponseMocked = jest.mocked(badResponse);
const getSignedUrlMocked = jest.mocked(getSignedUrl);

describe('importProductsFile', () => {
  const s3Mocked = mockClient(S3Client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    s3Mocked.reset();
  });

  const mockedEvent = {
    queryStringParameters: {
      name: faker.internet.userName(),
    },
  };

  it('should successfulResponse if signed url was returned', async () => {
    s3Mocked.on(PutObjectCommand).resolves({});
    getSignedUrlMocked.mockReturnValueOnce(faker.internet.url());
    await importProductsFile(mockedEvent);

    expect(getSignedUrlMocked).toHaveBeenCalled();
    expect(successfulResponseMocked).toHaveBeenCalled();
    expect(badResponseMocked).not.toHaveBeenCalled();
  });

  it('should call badResponse if signed url wat not returned', async () => {
    getSignedUrlMocked.mockReturnValueOnce('');
    await importProductsFile(mockedEvent);

    expect(getSignedUrlMocked).toHaveBeenCalled();
    expect(successfulResponseMocked).not.toHaveBeenCalled();
    expect(badResponseMocked).toHaveBeenCalled();
  });
});
