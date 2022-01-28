import * as express from 'express';
import { Authorized, Body, Get, JsonController, Post, Req, Res } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { AuthOService } from '../../auth/AuthOService';
import { LoginRequest } from './requests/auth';
import { LoginResponse } from './responses/auth';
import { JSend } from './responses/jsend';

@JsonController()
export class AuthController {
  constructor(private authOService: AuthOService) {}

  @Post('/login')
  @OpenAPI({
    summary: 'Login to the server',
    description:
      'Login to the endpoint to access the other endpoint apis. (Must login with Admin credentials to access all "/user" except "/users/me" apis). Admin credentials are username: "admin", password: "admin".',
  })
  @ResponseSchema(JSend)
  public async login(
    @Req() request: express.Request,
    @Res() response: express.Response,
    @Body({ required: true }) body: LoginRequest
  ): Promise<LoginResponse> {
    const { username, password } = body;
    const user = await this.authOService.validateUser(username, password);
    const token = await this.authOService.createToken(request, response, user);
    const data = new LoginResponse(token);
    return data;
  }

  @Get('/logout')
  @Authorized()
  public logout(@Res() response: express.Response): void {
    this.authOService.invalidateToken(response);
  }
}
