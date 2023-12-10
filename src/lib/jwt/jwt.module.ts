import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret', 'secret'),
        signOptions: {
          expiresIn: config.get('jwt.access_expiry', '1d'),
          algorithm: 'HS256',
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class NestJwtModule {}
