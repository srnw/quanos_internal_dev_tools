import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DevTools Hub API')
    .setDescription('REST API for managing internal engineering tool links')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document)

  const config = app.get(ConfigService)

  app.enableCors({
    origin: config.getOrThrow<string>('frontendUrl'),
    credentials: true,
  })

  const port = config.getOrThrow<number>('port')

  await app.listen(port)
  logger.log(`Application running on port ${port}`)
  logger.log(`Swagger docs available at http://localhost:${port}/api/docs`)
}

bootstrap()
