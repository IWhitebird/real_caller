import { UserModule } from './../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@src/prisma/prisma.module';
import AppConfig from '@config/app.config';
import { AuthModule } from '@modules/auth/auth.module';
import { AppController } from '@modules/app/app.controller';
import { SpamModule } from '@modules/spam/spam.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig],
    }),
    PrismaModule,
    AuthModule,
    SpamModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
