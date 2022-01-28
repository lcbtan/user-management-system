import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty({ message: 'username is required' })
  @IsString({ message: 'username should be string' })
  public username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password should be string' })
  public password: string;
}
