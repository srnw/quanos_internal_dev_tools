import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<{ status(code: number): { json(body: unknown): void } }>()
    const request = ctx.getRequest<{ url: string }>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const res =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error'
    const message =
      typeof res === 'string' ? res : ((res as Record<string, unknown>).message ?? res)

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception)
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    })
  }
}
