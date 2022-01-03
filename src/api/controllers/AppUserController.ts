import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { AppUser } from '../models/AppUser';
import { AppUserService } from '../services/AppUserService';
import { PetResponse } from './PetController';

class BaseAppUser {
    @IsNotEmpty()
    public firstName: string;

    @IsNotEmpty()
    public lastName: string;

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    public username: string;
}

export class AppUserResponse extends BaseAppUser {
    @IsUUID()
    public id: string;

    @ValidateNested({ each: true })
    @Type(() => PetResponse)
    public pets: PetResponse[];
}

class CreateAppUserBody extends BaseAppUser {
    @IsNotEmpty()
    public password: string;
}

@Authorized()
@JsonController('/users')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class UserController {

    constructor(
        private userService: AppUserService
    ) { }

    @Get()
    @ResponseSchema(AppUserResponse, { isArray: true })
    public find(): Promise<AppUser[]> {
        return this.userService.find();
    }

    @Get('/me')
    @ResponseSchema(AppUserResponse, { isArray: true })
    public findMe(@Req() req: any): Promise<AppUser[]> {
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
    public create(@Body() body: CreateAppUserBody): Promise<AppUser> {
        const user = new AppUser();
        user.email = body.email;
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.password = body.password;
        user.username = body.username;

        return this.userService.create(user);
    }

    @Put('/:id')
    @ResponseSchema(AppUserResponse)
    public update(@Param('id') id: string, @Body() body: BaseAppUser): Promise<AppUser> {
        const user = new AppUser();
        user.email = body.email;
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.username = body.username;

        return this.userService.update(id, user);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.userService.delete(id);
    }

}
