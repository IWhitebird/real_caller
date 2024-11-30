import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phone_no: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateContactsDTO {
  @IsNotEmpty()
  @IsString()
  owner_id : string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phone_no: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}