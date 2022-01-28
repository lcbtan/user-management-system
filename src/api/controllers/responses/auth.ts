import { IsEmpty, IsString } from 'class-validator';

export class LoginResponse {
  @IsEmpty()
  @IsString()
  public access_token: string;

  constructor(token: string) {
    this.access_token = token;
  }
}
