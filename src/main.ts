import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from '@modules/app/app.module';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { Logger,ValidationPipe,VersioningType,} from '@nestjs/common';
import { VersioningOptions } from '@nestjs/common/interfaces/version-options.interface';
import { AllExceptionsFilter } from '@filters/all-exception.filter';
import { PrismaClientExceptionFilter } from '@filters/prisma-client-exception.filter';
import { ValidationExceptionFilter } from '@filters/validation-exception.filter';
import validationExceptionFactory from '@filters/validation-exception-factory';
import { BadRequestExceptionFilter } from '@filters/bad-request-exception.filter';
import { ThrottlerExceptionsFilter } from '@filters/throttler-exception.filter';
import { AccessExceptionFilter } from '@filters/access-exception.filter';
import { NotFoundExceptionFilter } from '@filters/not-found-exception.filter';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter , NestFastifyApplication } from '@nestjs/platform-fastify';
import { apiReference } from '@scalar/nestjs-api-reference'
import helmet from '@fastify/helmet'
import compression from '@fastify/compress';
import { 
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerModuleOptions,
  ThrottlerStorage 
} from '@nestjs/throttler';
//This import is for types due to SWC Ignore this import
import metadata from './metadata';

async function bootstrap() {
  /**
   * Init App
  */
  {
    var app: NestFastifyApplication =
      await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
          cors: true,
          bodyParser: true,
        },
      );

  }
    /**
     * Enable Helmet for security and compression for performance
    */
  {
    await app.register(helmet);
    await app.register(compression, { encodings: ['gzip', 'deflate'] });
  }

  const configService: ConfigService<any, boolean> = app.get(ConfigService);
  const appConfig = configService.get('app');
  /**
   * ValidationPipe options
   * https://docs.nestjs.com/pipes#validation-pipe
   */
  {
    const options = {
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    };

    app.useGlobalPipes(
      new ValidationPipe({
        ...options,
        exceptionFactory: validationExceptionFactory,
      }),
    );
  }

  /**
   * loggerLevel: 'error' | 'warn' | 'log' | 'verbose' | 'debug' | 'silly';
   * https://docs.nestjs.com/techniques/logger#log-levels
   */
  {
    const options = appConfig.loggerLevel;
    app.useLogger(options);
  }

  /**
   * Enable global filters
   * https://docs.nestjs.com/exception-filters
   */
  {
    const { httpAdapter } = app.get(HttpAdapterHost);

    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new AccessExceptionFilter(httpAdapter),
      new NotFoundExceptionFilter(),
      new BadRequestExceptionFilter(),
      new PrismaClientExceptionFilter(httpAdapter),
      new ValidationExceptionFilter(),
      new ThrottlerExceptionsFilter(),
    );
  }

  /**
   * Enable versioning for all routes
   * https://docs.nestjs.com/openapi/multiple-openapi-documents#versioning
   */
  {
    const options: VersioningOptions = {
      type: VersioningType.URI,
      defaultVersion: '1',
    };

    app.enableVersioning(options);
  }


  const options : any = new DocumentBuilder()
    .setTitle('Real Caller')
    .setDescription('Real Caller Api v1 Documentation')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();
    
  await SwaggerModule.loadPluginMetadata(metadata);
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('/api', app, document, {
    swaggerOptions: {
      // If set to true, it persists authorization data,
      // and it would not be lost on browser close/refresh
      persistAuthorization: true,
    },
  });

  app.use(
    '/docs',
    apiReference({
      theme : 'bluePlanet',
      layout : 'classic',
      withFastify: true,
      spec: {
        content: document,
        preparsedContent: document,
      },
      searchHotKey : 'shift+s',
    }),
  )

  await app.listen(appConfig.port, appConfig.host);
  
  return appConfig;
}

bootstrap().then((appConfig) => {
  Logger.log(`Running in http://localhost:${appConfig.port}`, 'Bootstrap');
  Logger.log(`Swagger At -> http://localhost:${appConfig.port}/api`, 'Bootstrap');
  Logger.log(`Scaler Swagger At -> http://localhost:${appConfig.port}/docs`, 'Bootstrap');
});
