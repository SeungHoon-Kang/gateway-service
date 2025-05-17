import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ProxyController } from './proxy/proxy.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '../.env'), // .env가 gateway-service 루트에 있으므로!
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [ProxyController],
  providers: [JwtStrategy],
})
export class AppModule {}
