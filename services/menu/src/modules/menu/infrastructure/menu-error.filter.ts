import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import {
  MenuDomainError,
  InvalidMenuNameError,
  EmptyMenuItemsError,
} from '../../domain/errors/menu-domain.error';

@Catch(MenuDomainError)
export class MenuErrorFilter implements ExceptionFilter {
  catch(exception: MenuDomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;

    if (exception instanceof InvalidMenuNameError) {
      status = 400;
    } else if (exception instanceof EmptyMenuItemsError) {
      status = 400;
    }

    response.status(status).json({ error: exception.name, message: exception.message });
  }
}
