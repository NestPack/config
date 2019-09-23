export interface EnvConfig {
  [key: string]: any;
}

export interface ConfigOptions {
  /**
   * Path to folder containing .env files
   *
   * Defaults to project root
   */
  folder?: string;

  /**
   * Path to project root.
   *
   * Default attempts to get project root automatically. Only set if you're having issues.
   * If using npm/yarn link, this value will need to be set.
   */
  projectRoot?: string;

  /**
   * Default environmtal variables for any environment
   */
  defaults?: EnvConfig;

  /**
   * Programmatic overrides for any environmental variables
   */
  overrides?: EnvConfig;

  /**
   * Generated constants file output location relative to project root
   */
  constantsOutputDir?: string;

  /**
   * When true, the ConfigModule will create src/config.constants.ts
   *
   * This file will enable a developer to use autocompletion to discover available
   * env variables.
   *
   * The variables are generated from what is found in the ENV file, the overrides, and the defaults.
   */
  generateConstants?: boolean;

  /**
   * This options allows a developer to set which environments the constants will be generated in.
   *
   * Default: development, undefined
   * undefined is used if no env environment is set.
   */
  generateConstantsEnviroments?: string[];
}

/** WARNING: For internal use only */
export interface ConfigOptionsInternal {
  /**
   * Path to folder containing .env files
   *
   * Defaults to project root
   */
  folder: string;

  /**
   * Path to project root.
   *
   * Default attempts to get project root automatically. Only set if you're having issues.
   * If using npm/yarn link, this value will need to be set.
   */
  projectRoot: string;

  /**
   * Default environmtal variables for any environment
   */
  defaults: EnvConfig;

  /**
   * Programmatic overrides for any environmental variables
   */
  overrides: EnvConfig;

  /**
   * Generated constants file output location relative to project root
   */
  constantsOutputDir: string;

  /**
   * When true, the ConfigModule will create src/config.constants.ts
   *
   * This file will enable a developer to use autocompletion to discover available
   * env variables.
   *
   * The variables are generated from what is found in the ENV file, the overrides, and the defaults.
   */
  generateConstants: boolean;

  /**
   * This options allows a developer to set which environments the constants will be generated in.
   *
   * Default: development, undefined
   * undefined is used if no env environment is set.
   */
  generateConstantsEnviroments: string[];
}
