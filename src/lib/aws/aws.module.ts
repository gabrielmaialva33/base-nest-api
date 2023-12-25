import { Module } from '@nestjs/common';

import { AwsS3Service } from '@src/lib/aws/aws.s3.service';
import { ConfigurableModuleClass } from '@src/lib/aws/aws.module-definition';

@Module({
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsModule extends ConfigurableModuleClass {
  constructor(private readonly awsS3Service: AwsS3Service) {
    super();
  }
}
