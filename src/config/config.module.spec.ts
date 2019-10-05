import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import { ConfigModule } from './config.module';
import { Module, Injectable } from '@nestjs/common';

describe('ConfigModule', () => {
  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.register()],
    }).compile();

    const service = module.get<ConfigService>(ConfigService);
    expect(service).toBeDefined();
  });

  it('should get environment .env', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.register({ projectRoot: './test/test-env' })],
    }).compile();

    const service = module.get<ConfigService>(ConfigService);

    const result = service.get('VAR');
    expect(result).toBe('hellotest');
  });

  it('should default to development.env', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register({ projectRoot: './test/development-env' }),
      ],
    }).compile();

    const service = module.get<ConfigService>(ConfigService);

    const result = service.get('VAR');
    expect(result).toBe('hellodev');
  });

  it('should return process env if no .env file', async () => {
    process.env.VAR = 'helloprocess';
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.register({ projectRoot: './test/no-env' })],
    }).compile();

    const service = module.get<ConfigService>(ConfigService);

    const result = service.get('VAR');
    expect(result).toBe('helloprocess');
  });

  it('should return process env if set instead of development.env default', async () => {
    process.env.VAR = 'helloprocess';
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register({ projectRoot: './test/development-env' }),
      ],
    }).compile();

    const service = module.get<ConfigService>(ConfigService);

    const result = service.get('VAR');
    expect(result).toBe('helloprocess');
  });

  it('should return process env if set instead of environment .env', async () => {
    process.env.VAR = 'helloprocess';
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.register({ projectRoot: './test/test-env' })],
    }).compile();

    const service = module.get<ConfigService>(ConfigService);

    const result = service.get('VAR');
    expect(result).toBe('helloprocess');
  });

  it('should return override over process', async () => {
    process.env.VAR = 'helloprocess';
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.register({ overrides: { VAR: 'overridden' } })],
    }).compile();

    const service = module.get<ConfigService>(ConfigService);

    const result = service.get('VAR');
    expect(result).toBe('overridden');
  });

  it('should return default if nothing set and default exists', async () => {
    delete process.env.VAR;
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.register({ defaults: { VAR: 'default' } })],
    }).compile();

    const service = module.get<ConfigService>(ConfigService);

    const result = service.get('VAR');
    expect(result).toBe('default');
  });

  it('should return undefined if no default', async () => {
    delete process.env.VAR;
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.register()],
    }).compile();

    const service = module.get<ConfigService>(ConfigService);

    const result = service.get('VAR');
    expect(result).toBeUndefined();
  });

  it('should generate typefile', async () => {
    delete process.env.VAR;
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register({
          projectRoot: './test/test-env',
          overrides: {
            ONE: 'something',
          },
          defaults: {
            TWO: 'something else',
          },
        }),
      ],
    }).compile();

    const service = module.get<ConfigService>(ConfigService);
    const typefile = service._generateTypeFile();
    expect(typefile).toBe(`
export const CONFIG = {
  TWO:'TWO',
  VAR:'VAR',
  ONE:'ONE',
}
`);
  });

  it('should allow ConfigService outside of module injection system', () => {
    const service = new ConfigService({
      projectRoot: './test/development-env',
    });

    const result = service.get('VAR');
    expect(result).toBe('hellodev');
  });

  it('should make ConfigModule global', async () => {
    @Injectable()
    class ChildService {
      constructor(private readonly configService: ConfigService) {}
      getVar(name: string) {
        return this.configService.get(name);
      }
    }
    @Module({ providers: [ChildService] })
    class ChildModule {}

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.register({
          projectRoot: './test/development-env',
        }),
        ChildModule,
      ],
    }).compile();

    const childService = module.get<ChildService>(ChildService);
    expect(childService.getVar('VAR')).toBe('hellodev');
  });
});
