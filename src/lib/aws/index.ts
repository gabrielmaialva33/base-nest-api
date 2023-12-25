import { Global, Module } from '@nestjs/common';

import { AwsModule } from '@src/lib/aws/aws.module';
import { AwsS3Service } from '@src/lib/aws/aws.s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    AwsModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Configs, true>) => ({
        baseUrl: configService.get('aws.s3.cloudfrontUrl', { infer: true }),
        bucket: configService.get('aws.s3.bucket', { infer: true }),
        endpoint: configService.get('aws.s3.endpoint', { infer: true }),
        region: configService.get('aws.s3.region', { infer: true }),
        credentials: {
          accessKeyId: configService.get('aws.s3.accessKeyId', { infer: true }),
          secretAccessKey: configService.get('aws.s3.secretAccessKey', {
            infer: true,
          }),
        },
      }),
    }),
  ],
  exports: [AwsModule],
})
export class NestAwsModule {}
