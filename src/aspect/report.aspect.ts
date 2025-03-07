import { Aspect, IMethodAspect, JoinPoint } from '@midwayjs/core';
import { HomeController } from '../controller/home.controller';

@Aspect(HomeController)
export class ReportAspect implements IMethodAspect {
  async before(point: JoinPoint) {
    console.log('before home router run');
  }
}
