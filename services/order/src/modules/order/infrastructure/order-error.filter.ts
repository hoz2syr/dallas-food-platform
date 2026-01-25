import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { OrderDomainError } from '../../domain/errors/order-domain.error';
import { mapToApiError } from '../../../../../shared/errors/http-exception.mapper';

@Catch(OrderDomainError)
export class OrderErrorFilter implements ExceptionFilter {
  catch(exception: OrderDomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const mapped = mapToApiError(exception);
    res.status(mapped.status).json(mapped.body);
  }
}
