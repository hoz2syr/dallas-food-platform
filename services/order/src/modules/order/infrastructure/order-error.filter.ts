import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { OrderDomainError, EmptyOrderItemsError, InvalidOrderStateError } from '../../domain/errors/order-domain.error';

@Catch(OrderDomainError)
export class OrderErrorFilter implements ExceptionFilter {
  catch(exception: OrderDomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof EmptyOrderItemsError) {
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof InvalidOrderStateError) {
      status = HttpStatus.CONFLICT;
    }

    res.status(status).json({ error: exception.name, message: exception.message });
  }
}
