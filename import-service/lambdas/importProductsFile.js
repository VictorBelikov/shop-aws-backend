import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { badResponse, successfulResponse } from '../helpers/responses';
import { customError } from '../helpers/errorService';
import { IMPORT_BUCKET, UPLOAD_FOLDER } from '../constants/constants';
import { STATUS_CODE } from '../constants/statusCode';

const s3 = new S3({ region: process.env.AWS_REGION });
const BUCKET = IMPORT_BUCKET;

export const importProductsFile = async (event) => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      ContentType: 'text/csv',
      Key: `${UPLOAD_FOLDER}/${event.queryStringParameters.name}`,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    if (!url || url.length === 0) {
      throw customError('Signed url was not created', STATUS_CODE.UNPROCESSABLE_ENTITY);
    }

    return successfulResponse({ url });
  } catch (e) {
    return badResponse(e);
  }
};
