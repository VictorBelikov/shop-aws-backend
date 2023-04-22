import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import { mockClient } from 'aws-sdk-client-mock';
import { Readable } from 'stream';
import { faker } from '@faker-js/faker';
import { importFileParser } from '../importFileParser';
import { badResponse, successfulResponse } from '../../helpers/responses';

jest.mock('../../helpers/responses', () => ({
  successfulResponse: jest.fn(),
  badResponse: jest.fn(),
}));

const successfulResponseMocked = jest.mocked(successfulResponse);
const badResponseMocked = jest.mocked(badResponse);

describe('importFileParser', () => {
  const s3Mocked = mockClient(S3Client);

  afterAll(() => {
    s3Mocked.reset();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockedEvent = {
    Records: [{ s3: { object: { key: faker.datatype.uuid() } } }],
  };

  it('should call successfulResponse if event is appropriate type', async () => {
    const stream = new Readable();
    const sdkStream = sdkStreamMixin(stream);
    stream.push(null);
    s3Mocked.on(GetObjectCommand).resolves({ Body: sdkStream });

    await importFileParser(mockedEvent);

    expect(successfulResponseMocked).toHaveBeenCalled();
    expect(badResponseMocked).not.toHaveBeenCalled();
  });

  it('should call badResponse if event is not an appropriate type', async () => {
    await importFileParser({});

    expect(successfulResponseMocked).not.toHaveBeenCalled();
    expect(badResponseMocked).toHaveBeenCalled();
  });
});
