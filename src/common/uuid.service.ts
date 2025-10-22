import { Inject, Injectable } from '@nestjs/common';
import { UUID_TOKEN } from './common.module';

@Injectable()
export class UuidService {
  constructor(@Inject(UUID_TOKEN) private readonly uuidGenerator: () => string) {}

  generateUuid(): string {
    return this.uuidGenerator();
  }
}