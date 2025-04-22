import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import PrettyError from 'pretty-error';

const pe = new PrettyError();

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (exception instanceof Error) {
      console.log();
      console.error(pe.render(exception));
    } else {
      this.logger.error(`Unknown Exception: ${JSON.stringify(exception)}`);
    }

    response.status(status).json({
      statusCode: status,
      message: 'Internal server error',
    });
  }
}
