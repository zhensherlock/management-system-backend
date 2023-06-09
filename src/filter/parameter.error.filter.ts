import { Catch } from '@midwayjs/core';
import { ParameterError } from '../error';
import { ValidateErrorFilter } from './validate.error.filter';

@Catch(ParameterError)
export class ParameterErrorFilter extends ValidateErrorFilter {}
