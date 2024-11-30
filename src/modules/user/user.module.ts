import { forwardRef, Inject, Module } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { PrismaModule } from '@src/prisma/prisma.module';
import { UserController } from '@modules/user/user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}