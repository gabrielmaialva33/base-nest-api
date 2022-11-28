import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

import { StoreLoggerDto } from '@logger/dto/store-logger.dto';
import { LoggerEntity } from '@logger/entities/logger.entity';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(LoggerEntity)
    private readonly loggerRepository: EntityRepository<LoggerEntity>,
  ) {}

  async store(data: StoreLoggerDto) {
    const log = this.loggerRepository.create(data);
    await this.loggerRepository.persistAndFlush(log);
  }
}
