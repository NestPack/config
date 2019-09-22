import { Injectable, Inject, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { CONFIG_OPTIONS } from './constants';
import { ConfigOptionsInternal } from './interfaces';

/**
 * Service for getting environmental variables.
 *
 * Will grab variables with priority of:
 * - overrides option
 * - process.env (set by the host)
 * - environment-name.env file OR development.env file as fallback
 * - defaults option
 */
@Injectable()
export class ConfigService {
  private readonly envConfig: {};

  constructor(@Inject(CONFIG_OPTIONS) private options: ConfigOptionsInternal) {
    this.options = {
      ...{
        folder: './',
        projectRoot: '../../',
        defaults: {},
        overrides: {},
        generateConstants: false,
        generateConstantsEnviroments: ['development'],
        constantsOutputDir: './src/',
      },
      ...this.options,
    };

    // Try environment
    let config = this.readEnvFile(`${process.env.NODE_ENV}.env`);

    // try development.env default
    if (!config) {
      config = this.readEnvFile(`development.env`);
    }

    // Fall back to nothing
    if (!config) config = {};

    this.envConfig = {
      ...this.options.defaults,
      ...config,
      ...this.options.overrides,
    };
    if (
      this.options.generateConstants &&
      this.options.generateConstantsEnviroments.includes(process.env.NODE_ENV)
    ) {
      this.generateTypes();
    }
  }

  private readEnvFile(filePath: string) {
    try {
      const envFile = path.resolve(
        __dirname,
        this.options.projectRoot,
        this.options.folder,
        filePath,
      );

      return dotenv.parse(fs.readFileSync(envFile));
    } catch (e) {
      return false;
    }
  }

  /**
   * Returns process env if set, otherwise .env file value
   */
  get(key: string): any {
    // Must check this specifically to override process value
    const overrideValue = this.options.overrides[key];
    if (typeof overrideValue !== 'undefined') return overrideValue;

    const processValue = process.env[key];
    if (typeof processValue !== 'undefined') return processValue;

    // overrides, defaults, and .env file set values are merged into one.
    const envFileValue = this.envConfig[key];
    if (typeof envFileValue !== 'undefined') return envFileValue;
  }

  generateTypes() {
    const typeFile = this._generateTypeFile();
    try {
      fs.writeFileSync(
        path.resolve(
          __dirname,
          this.options.projectRoot,
          this.options.constantsOutputDir,
          'config.constants.ts',
        ),
        typeFile,
        { encoding: 'utf8' },
      );
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * INTERNAL USE ONLY
   *
   * Generates a file for env types based on the config values
   */
  _generateTypeFile() {
    const keys = Object.keys(this.envConfig);
    // TODO: Try to extract comments between lines to generate docblocks
    const typeFile = `
export const CONFIG = {
${keys.map(key => `  ${key}:'${key}',`).join('\n')}
}
`;
    return typeFile;
  }
}
