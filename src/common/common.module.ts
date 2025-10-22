import { Module } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

// Provider token for UUID function
export const UUID_TOKEN = 'UUID_TOKEN';

@Module({
  providers: [
    {
      provide: UUID_TOKEN,
      useValue: uuidv4,
    },
  ],
  exports: [UUID_TOKEN],
})
export class CommonModule {}