import { Catch } from '@midwayjs/core';
import { CommonError } from '../error';
import { ValidateErrorFilter } from './validate.error.filter';

@Catch(CommonError)
export class CommonErrorFilter extends ValidateErrorFilter {}
