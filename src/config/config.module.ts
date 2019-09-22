import { Module, DynamicModule, Logger } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigOptions } from './interfaces';
import { CONFIG_OPTIONS } from './constants';

/**
 * Provides `ConfigService` for getting environmental variables.
 *
 * Will grab variables with priority of:
 * - overrides option
 * - process.env (set by the host)
 * - environment-name.env file OR development.env file as fallback
 * - defaults option
 *
 * Defaults assume that config module is located at:
 *
 * `<PROJECT_ROOT>/src/config`
 *
 * Default assume that .env files are located at:
 *
 * `<PROJECT_ROOT>/.`
 */
@Module({
  providers: [ConfigService],
})
export class ConfigModule {
  static register(options: ConfigOptions = {}): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        Logger,
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
