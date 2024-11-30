import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDTO,
  RegisterDTO,
} from '@modules/auth/dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }
}
