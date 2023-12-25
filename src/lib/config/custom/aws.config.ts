import { registerAs } from '@nestjs/config';
import { Env } from '@src/env';

export const aws = registerAs('aws', () => ({
  s3: {
    accessKeyId: Env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: Env.AWS_S3_SECRET_ACCESS_KEY,
    region: Env.AWS_S3_REGION,
    bucket: Env.AWS_S3_BUCKET,
    endpoint: Env.AWS_S3_ENDPOINT,
    cloudfrontUrl: Env.S3_CLOUDFRONT_URL,
  },
}));
