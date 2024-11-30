import { Controller, Get, Post, Body, UseGuards, Req, Query, Param } from '@nestjs/common';
import { SpamService } from '@modules/spam/spam.service';
import { MarkSpamDTO, SearchSpamDTO } from '@modules/spam/dto/spam.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { Throttle } from '@nestjs/throttler';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('spam')
@ApiTags('Spam')
export class SpamController {
  constructor(private readonly spamService: SpamService) {}
  
  @Get('search')
  async search(@Query() searchSpam : SearchSpamDTO , @Req() { user }) {
    return this.spamService.search(searchSpam , user);
  }

  @Get('result/:id')
  async getUser(
    @Param('id') id: string ,
    @Req() { user }) {
    return this.spamService.getResult(id , user);
  }

  @Post('mark-spam')
  async markSpam(@Body() markSpam: MarkSpamDTO , @Req() { user }) {
    return this.spamService.markSpam(markSpam , user);
  }

}