import { Module } from '@nestjs/common';

import { IsUniqueConstraint } from '@common/validators';
import { OrmModule } from '@src/lib/orm/orm.module';

@Module({
  providers: [IsUniqueConstraint],
  imports: [OrmModule],
  exports: [IsUniqueConstraint],
})
export class CommonModule {}
