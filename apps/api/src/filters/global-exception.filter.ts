import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import ErrorStackParser from 'error-stack-parser';
import path from 'path';
import chalk from 'chalk';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (exception instanceof Error) {
      const header = `Uncaught Exception: "${exception.message}"`;
      this.logger.error(chalk.bgBlack(chalk.white(header)));
      const stack = ErrorStackParser.parse(exception);
      for (const step of stack) {
        const { fileName, lineNumber } = step;
        const relativePath = path.relative(process.cwd(), fileName || '');
        this.logger.error(chalk.white(`${relativePath}:${lineNumber}`));
      }
    } else {
      this.logger.error(`Unknown Exception: ${JSON.stringify(exception)}`);
    }

    response.status(status).json({
      statusCode: status,
      message: 'Internal server error',
    });
  }
}
