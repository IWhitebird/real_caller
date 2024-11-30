import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { VALIDATION_ERROR } from '@constants/errors.constants';
import { ValidationException } from './validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response = context.getResponse();

    const [code, message] = VALIDATION_ERROR.split(':');

    return response.code(HttpStatus.UNPROCESSABLE_ENTITY).send({
      success: false,
      error: {
        code: parseInt(code, 10),
        message: message.trim(),
        details: exception.validationErrors,
      },
    });
  }
}
