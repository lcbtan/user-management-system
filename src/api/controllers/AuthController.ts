import * as express from 'express';
import { Authorized, BodyParam, Get, JsonController, OnUndefined, Post, Req, Res } from 'routing-controllers';

import { AuthOService } from '../../auth/AuthOService';

@JsonController()
export class AuthController {
  constructor(private authOService: AuthOService) {}

  @Post('/login')
  @OnUndefined(204)
  public async login(
    @Req() request: express.Request,
    @Res() response: express.Response,
    @BodyParam('username', { required: true }) username: string,
    @BodyParam('password', { required: true }) password: string
  ): Promise<void> {
    const user = await this.authOService.validateUser(username, password);
    await this.authOService.createToken(request, response, user);
  }

  @Get('/logout')
  @Authorized()
  @OnUndefined(204)
  public logout(@Res() response: express.Response): void {
    this.authOService.invalidateToken(response);
  }
}
