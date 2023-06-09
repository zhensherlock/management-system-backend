import { Catch } from '@midwayjs/core';
import { CommonWarning } from '../error';
import { ValidateErrorFilter } from './validate.error.filter';

@Catch(CommonWarning)
export class CommonWarningFilter extends ValidateErrorFilter {}
