import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

export enum AppUserRole {
  Admin = 'admin',
  Guest = 'guest',
  User = 'user',
}

@Entity({ name: 'app_user' })
export class AppUser {
  public static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public static comparePassword(user: AppUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column({ name: 'first_name' })
  public firstName: string;

  @IsNotEmpty()
  @Column({ name: 'last_name' })
  public lastName: string;

  @IsNotEmpty()
  @Column()
  public email: string;

  @IsNotEmpty()
  @Column()
  @Exclude()
  public password: string;

  @IsNotEmpty()
  @Column()
  public username: string;

  @Column({
    enum: AppUserRole,
    default: AppUserRole.User,
  })
  public role: AppUserRole;

  public toString(): string {
    return `${this.firstName} ${this.lastName} (${this.email})`;
  }

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.password = await AppUser.hashPassword(this.password);
  }
}
