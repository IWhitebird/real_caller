import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class LoginDTO {
  @IsString()
  @MaxLength(15)
  phone_no: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  // @IsStrongPassword()
  password: string;

  @IsString()
  @MaxLength(15)
  phone_no: string;

  @IsOptional()
  @IsEmail()
  email ?: string;
}