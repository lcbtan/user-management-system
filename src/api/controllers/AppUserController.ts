import { IsAlpha, IsEmail, IsNotEmpty, IsNumberString, IsUUID, Length, MinLength } from 'class-validator';
import {
  Authorized,
  BadRequestError,
  Body,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Patch,
  Post,
  QueryParams,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { AppUser } from '../models/AppUser';
import { AppUserService } from '../services/AppUserService';

class BaseAppUser {
  @IsNotEmpty()
  @IsAlpha()
  public firstName: string;

  @IsNotEmpty()
  @IsAlpha()
  public lastName: string;

  @IsNotEmpty()
  public address: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4)
  public postCode: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(12, 12) // For example: 639123456891
  public contactNo: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public username: string;
}

export class AppUserResponse extends BaseAppUser {
  @IsUUID()
  public id: string;
}

class CreateAppUserBody extends BaseAppUser {
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}

@Authorized()
@JsonController('/users')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class UserController {
  constructor(private userService: AppUserService) {}

  @Get()
  @ResponseSchema(AppUserResponse, { isArray: true })
  public find(): Promise<AppUser[]> {
    return this.userService.find();
  }

  @Get('/me')
  @ResponseSchema(AppUserResponse, { isArray: true })
  public static findMe(@Req() req: any): Promise<AppUser[]> {
    return req.user;
  }

  @Get('/:id')
  @OnUndefined(UserNotFoundError)
  @ResponseSchema(AppUserResponse)
  public one(@Param('id') id: string): Promise<AppUser | undefined> {
    return this.userService.findOne(id);
  }

  @Post()
  @ResponseSchema(AppUserResponse)
  public create(@Body({ required: true }) body: CreateAppUserBody): Promise<AppUser> {
    const user = new AppUser();
    user.email = body.email;
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.password = body.password;
    user.username = body.username;
    user.address = body.address;
    user.postCode = body.postCode;
    user.contactNo = body.contactNo;

    return this.userService.create(user);
  }

  @Patch('/:id')
  @OnUndefined(204)
  @ResponseSchema(AppUserResponse)
  public async update(@Param('id') id: string, @Body() body: Partial<BaseAppUser>): Promise<AppUser | void> {
    const user = new AppUser();
    if (body.email) {
      user.email = body.email;
    }
    if (body.firstName) {
      user.firstName = body.firstName;
    }
    if (body.lastName) {
      user.lastName = body.lastName;
    }
    if (body.username) {
      user.username = body.username;
    }
    if (body.address) {
      user.address = body.address;
    }
    if (body.postCode) {
      user.postCode = body.postCode;
    }
    if (body.contactNo) {
      user.contactNo = body.contactNo;
    }

    try {
      await this.userService.update(id, user);
    } catch (err) {
      throw new BadRequestError('Unable to update the given user');
    }
  }

  @Delete('/:id')
  @OnUndefined(204)
  public delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }

  @Delete()
  @OnUndefined(204)
  public deleteMany(@QueryParams() ids: string[]): Promise<void> {
    return this.userService.deleteMany(ids);
  }
}
