import { Module, Global } from '@nestjs/common';
import { AppEventEmitter } from '.';

@Global()
@Module({
  providers: [
    {
      provide: 'E',
      useFactory: () => new AppEventEmitter(),
    },
  ],
  exports: ['E'],
})
export class EventEmitterModule {}
