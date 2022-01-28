import { IsAlpha, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

import { AppUserRole } from '../../models/AppUser';

export class BaseAppUser {
  @IsNotEmpty()
  @IsAlpha()
  public firstName: string;

  @IsNotEmpty()
  @IsAlpha()
  public lastName: string;

  @IsNotEmpty()
  @IsString()
  public address: string;

  @IsNotEmpty()
  @IsString()
  public postCode: string;

  @IsNotEmpty()
  @IsString()
  public contactNo: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public username: string;
}

export class PartialBaseAppUser {
  @IsAlpha()
  @IsOptional()
  public firstName: string;

  @IsAlpha()
  @IsOptional()
  public lastName: string;

  @IsString()
  @IsOptional()
  public address: string;

  @IsString()
  @IsOptional()
  public postCode: string;

  @IsString()
  @IsOptional()
  public contactNo: string;

  @IsEmail()
  @IsOptional()
  public email: string;

  @IsString()
  @IsOptional()
  public username: string;
}

export class CreateAppUserBody extends BaseAppUser {
  @IsNotEmpty()
  @MinLength(6)
  public password: string;

  @IsEnum(AppUserRole)
  @IsOptional()
  public role: AppUserRole;
}
