import { IsEnum, IsUUID } from 'class-validator';

import { AppUserRole } from '../../models/AppUser';
import { BaseAppUser } from '../requests/appUser';

export class AppUserResponse extends BaseAppUser {
  @IsUUID()
  public id: string;

  @IsEnum(AppUserRole)
  public role: AppUserRole;
}
