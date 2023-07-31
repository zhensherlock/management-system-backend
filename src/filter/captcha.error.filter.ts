import { Catch } from '@midwayjs/core';
import { CaptchaError } from '../error';
import { ValidateErrorFilter } from './validate.error.filter';

@Catch(CaptchaError)
export class CaptchaErrorFilter extends ValidateErrorFilter {}
