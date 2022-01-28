import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';

import { JSend, JSendStatus } from '../controllers/responses/jsend';

@Interceptor()
export class JSendInterceptor implements InterceptorInterface {
  intercept(action: Action, content: unknown): JSend {
    const res = new JSend<unknown>(JSendStatus.Success);
    res.code = 200;
    res.data = content || null;
    return res;
  }
}
