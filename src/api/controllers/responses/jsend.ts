import { IsEnum, IsNotEmpty, IsNumber, NotEquals, ValidateIf } from 'class-validator';

export enum JSendStatus {
  Success = 'success',
  Fail = 'fail',
  Error = 'error',
}

export class JSend<T = unknown, U = undefined> {
  @IsNotEmpty()
  @IsEnum(JSendStatus)
  public status: JSendStatus;

  @IsNumber()
  public code: number;

  @ValidateIf((obj) => obj.status === JSendStatus.Success || obj.status === JSendStatus.Fail)
  @NotEquals(undefined)
  public data: T;

  @ValidateIf((obj) => obj.status === JSendStatus.Error)
  @IsNotEmpty()
  public error: U;

  constructor(status: JSendStatus) {
    this.status = status;
  }
}
