import { S3 } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import csvParser from 'csv-parser';
import { badResponse, successfulResponse } from '../helpers/responses';
import { IMPORT_BUCKET, PARSE_FOLDER, UPLOAD_FOLDER } from '../constants/constants';
import { customError } from '../helpers/errorService';
import { STATUS_CODE } from '../constants/statusCode';

const BUCKET = IMPORT_BUCKET;
const { AWS_REGION, SQS_URL } = process.env;
const s3 = new S3({ region: AWS_REGION });
const sqs = new SQSClient({ region: AWS_REGION });

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
          .on('data', async (data) => {
            result.push(data);
            const sendMessageCommand = new SendMessageCommand({ QueueUrl: SQS_URL, MessageBody: JSON.stringify(data) });
            await sqs.send(sendMessageCommand);
          })
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
