import { ValidationError } from 'class-validator';

import { JSend, JSendStatus } from './jsend';

export interface JSendErrorData {
  name: string;
  message: string;
  errors: ValidationError[];
}

const deleteTargetAndChildren = (err: ValidationError): void => {
  delete err.target;
  if (err.children.length === 0) {
    delete err.children;
    return;
  }
  err.children.forEach((errChild) => deleteTargetAndChildren(errChild));
};

export class JSendError extends JSend<unknown, JSendErrorData> {
  constructor(obj: JSendErrorData, code: number) {
    super(JSendStatus.Error);
    this.code = code;
    obj.errors.forEach((err) => deleteTargetAndChildren(err));
    this.error = obj;
  }
}
