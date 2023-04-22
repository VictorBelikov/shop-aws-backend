import { S3 } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { badResponse, successfulResponse } from '../helpers/responses';
import { IMPORT_BUCKET, PARSE_FOLDER, UPLOAD_FOLDER } from '../constants/constants';
import { customError } from '../helpers/errorService';
import { STATUS_CODE } from '../constants/statusCode';

const s3 = new S3({ region: process.env.AWS_REGION });
const BUCKET = IMPORT_BUCKET;

export const importFileParser = async (event) => {
  try {
    const products = await Promise.all(
      event.Records.map(async (record) => {
        const result = [];
        const { key } = record.s3.object;
        const params = { Bucket: BUCKET, Key: key };

        // get and parse object from 'upload'
        const response = await s3.getObject(params);
        response.Body?.pipe(csvParser({ separator: '|' }))
          .on('data', (data) => result.push(data))
          .on('error', () => {
            throw customError('Something went wrong while parsing', STATUS_CODE.UNPROCESSABLE_ENTITY);
          })
          .on('end', () => {
            console.log('Parsed products: ', result);
          });

        // copy object 'upload' --> 'parsed'
        await s3.copyObject({
          Bucket: BUCKET,
          CopySource: `${BUCKET}/${key}`,
          Key: key.replace(UPLOAD_FOLDER, PARSE_FOLDER),
        });

        // remove object from 'upload' folder
        await s3.deleteObject(params);

        return result;
      }),
    );

    return successfulResponse(products);
  } catch (e) {
    return badResponse(e);
  }
};
