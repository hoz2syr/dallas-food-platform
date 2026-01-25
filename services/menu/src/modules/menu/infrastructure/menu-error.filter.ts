import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import {
  MenuDomainError,
} from '../../domain/errors/menu-domain.error';
import { mapToApiError } from '../../../../../shared/errors/http-exception.mapper';

@Catch(MenuDomainError)
export class MenuErrorFilter implements ExceptionFilter {
  catch(exception: MenuDomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const mapped = mapToApiError(exception);
    response.status(mapped.status).json(mapped.body);
  }
}
