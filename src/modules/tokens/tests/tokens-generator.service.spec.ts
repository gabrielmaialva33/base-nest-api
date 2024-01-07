import { Test, TestingModule } from '@nestjs/testing';

import { TokensGeneratorService } from '@src/modules/tokens/services/tokens-generator.service';

describe('TokensGeneratorService', () => {
  let service: TokensGeneratorService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TokensGeneratorService],
    }).compile();

    service = module.get<TokensGeneratorService>(TokensGeneratorService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a token', (done) => {
      service.generateHashToken(30).subscribe((token) => {
        expect(token).toBeDefined();

        expect(token.rawToken).toBeDefined();
        expect(token.hashToken).toBeDefined();

        expect(token.rawToken.length).toEqual(30);

        done();
      });
    });
  });

  describe('hashToken', () => {
    it('should hash a token', (done) => {
      service.hashToken('token').subscribe((hash) => {
        expect(hash).toBeDefined();
        expect(hash.length).toBeGreaterThan(0);

        done();
      });
    });
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      const token = service.generateToken(30);

      expect(token).toBeDefined();
      expect(token.length).toEqual(30);
    });
  });
});
