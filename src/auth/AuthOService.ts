import * as express from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { promisify } from 'util';

import { AppUser } from '../api/models/AppUser';
import { AppUserRepository } from '../api/repositories/AppUserRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';
import { TDecodedToken } from './type';

@Service()
export class AuthOService {
  constructor(
    @Logger(__filename) private log: LoggerInterface,
    @OrmRepository() private userRepository: AppUserRepository
  ) {}

  public parseJWTToken(request: express.Request): string | undefined {
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
      return request.headers.authorization.split(' ')[1];
    }
    if (request.cookies?.jwt) {
      return request.cookies.jwt;
    }

    if (request.headers.cookie) {
      return request.headers.cookie.split('=')[1];
    }
    return undefined;
  }

  public async verifyTokenAndRetrieveUser(token: string): Promise<AppUser> {
    const decodedToken: TDecodedToken = await promisify(jwt.verify)(token, env.auth.jwt.secret);
    const currentUser = this.userRepository.findOne(decodedToken.id);
    return currentUser;
  }

  public async validateUser(username: string, password: string): Promise<AppUser | undefined> {
    this.log.info('Validate user => ', username);
    const user = await this.userRepository.findOne({ username });

    if (!user || !AppUser.comparePassword(user, password)) {
      throw new HttpError(401, 'Incorrect Email or Password');
    }

    return user;
  }

  public async createToken(req: express.Request, res: express.Response, user: AppUser): Promise<string> {
    const token = await this.signToken(user.id);
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + env.auth.jwt.cookieExpiration * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: 'strict',
    });
    return token;
  }

  public invalidateToken(res: express.Response): void {
    res.clearCookie('jwt');
  }

  private signToken(id: string): Promise<string> {
    return jwt.sign({ id }, env.auth.jwt.secret, {
      expiresIn: env.auth.jwt.tokenExpiration,
    });
  }
}
