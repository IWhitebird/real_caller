import { PrismaService } from '@src/prisma/primsa.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '@modules/auth/bcrypt.service';
import { User } from '@prisma/client';
import { LoginDTO, RegisterDTO } from '@modules/auth/dto/auth.dto';
import { JwtDTO } from '@modules/auth/dto/jwt.dto';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private userService: UserService,
  ) {}

  private generateAccessToken(user: Partial<User & any>) {
    const payload: JwtDTO = {
      user_id: user.id,
      phone_no: user.phone_no,
    };
    return this.jwtService.sign(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    return this.bcryptService.hash(password);
  }

  
  async login(data : LoginDTO): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { phone_no : data.phone_no }});

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordMatch = await this.bcryptService.compare(
      data.password,
      user.password,
    );

    if (!isPasswordMatch ) {
      throw new BadRequestException('Invalid password');
    }

    return {
      user,
      access_token: this.generateAccessToken(user)
    };
  }

  async register(data: RegisterDTO): Promise<any> {
    const { password, ...rest } = data;

    let user = await this.prisma.user.findUnique({
      where: { phone_no: rest?.phone_no },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    user = await this.userService.createUser({
      ...rest,
      password: await this.hashPassword(password),
    });

    return {
      user,
      access_token: this.generateAccessToken(user)
    };
  }

}
