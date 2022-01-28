import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParam,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { AppUser, AppUserRole } from '../models/AppUser';
import { AppUserService } from '../services/AppUserService';
import { CreateAppUserBody, PartialBaseAppUser } from './requests/appUser';
import { AppUserResponse } from './responses/appUser';

@Authorized(AppUserRole.ADMIN)
@JsonController('/users')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class UserController {
  constructor(private userService: AppUserService) {}

  @Get()
  @OpenAPI({
    summary: "Find all users (Won't include the password)",
  })
  @ResponseSchema(AppUserResponse, {
    isArray: true,
  })
  public find(): Promise<AppUser[]> {
    return this.userService.find();
  }

  @Authorized([AppUserRole.ADMIN, AppUserRole.USER])
  @Get('/me')
  @OpenAPI({
    summary: "Get Current User Info (Won't include the password)",
  })
  @ResponseSchema(AppUserResponse, { isArray: true })
  public findMe(@CurrentUser() user: AppUser): AppUser {
    return user;
  }

  @Get('/:id')
  @OpenAPI({
    summary: "Get User Info with the given id (Won't include the password)",
  })
  @ResponseSchema(AppUserResponse)
  public one(@Param('id') id: string): Promise<AppUser> {
    return this.userService.findOne(id);
  }

  @Post()
  @OpenAPI({
    summary: 'Create User based on given body',
  })
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
    user.role = body.role;

    return this.userService.create(user);
  }

  @Patch('/:id')
  @OpenAPI({
    summary:
      "Update a user with the given body details. You can't change a user's role or password. (Out of scope of the requirements)",
  })
  @ResponseSchema(AppUserResponse)
  public async update(
    @Param('id') id: string,
    @Body({ required: true }) body: PartialBaseAppUser
  ): Promise<AppUser | void> {
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
    if (body.contactNo) {
      user.contactNo = body.contactNo;
    }

    await this.userService.update(id, user);
  }

  @Delete('/:id')
  @OpenAPI({
    summary: 'Delete a user with the given id',
  })
  public delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }

  @Delete()
  @OpenAPI({
    summary: 'Delete users with the given ids in the query',
  })
  public deleteMany(@QueryParam('ids', { type: String }) ids: string[]): Promise<void> {
    return this.userService.deleteMany(ids);
  }
}
