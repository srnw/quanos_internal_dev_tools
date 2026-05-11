import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())

  const config = app.get(ConfigService)

  app.enableCors({
    origin: config.getOrThrow<string>('frontendUrl'),
    credentials: true,
  })

  const port = config.getOrThrow<number>('port')

  await app.listen(port)
  logger.log(`Application running on port ${port}`)
}

bootstrap()
