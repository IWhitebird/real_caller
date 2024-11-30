import { registerAs } from '@nestjs/config';
import * as path from 'path';

function parseLogLevel(level: string | undefined): string[] {
  if (!level) {
    return ['log', 'error', 'warn', 'debug', 'verbose'];
  }

  if (level === 'none') {
    return [];
  }

  return level.split(',');
}

export default registerAs('app', () => ({
  port: process.env.APP_PORT || 5000,
  host: process.env.APP_HOST || '0.0.0.0',
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  env: process.env.NODE_ENV || 'dev',
  loggerLevel: parseLogLevel(process.env.APP_LOGGER_LEVEL || 'log,error,warn,debug,verbose'),
  version: require(path.join(process.cwd(), 'package.json')).version,
}));
