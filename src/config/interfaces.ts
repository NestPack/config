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
   * Default assumes module located in ROOT/src/config
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

  generateConstants?: boolean;

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
   * Default assumes module located in ROOT/src/config
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

  generateConstants: boolean;

  generateConstantsEnviroments: string[];
}
