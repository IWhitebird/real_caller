import { Module } from '@nestjs/common';
import { SpamController } from '@modules/spam/spam.controller';
import { SpamService } from '@modules/spam/spam.service';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SpamController],
  providers: [SpamService],
})
export class SpamModule {}