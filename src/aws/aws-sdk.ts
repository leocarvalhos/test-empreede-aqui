import * as aws from 'aws-sdk';
import { config } from 'dotenv';
config();

const endpoint = new aws.Endpoint('s3.us-west-004.backblazeb2.com');
const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: '004ef47996b412c0000000006',
    secretAccessKey: 'K004d6l/Muc44Btdb9QGAVR8U0nVSeQ',
  },
});

export const uploadFile = async (
  path: string,
  buffer: any,
  mimetype: string,
) => {
  const file = await s3
    .upload({
      Bucket: 'teste-empreende',
      Key: path,
      Body: buffer,
      ContentType: mimetype,
    })
    .promise();

  return {
    url: file.Location,
    path: file.Key,
  };
};
