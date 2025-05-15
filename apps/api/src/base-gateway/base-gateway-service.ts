import type { HumanUser, HumanUserDto } from '@2pm/core';
import { WebSocketGateway } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { AppEventEmitter } from '../event-emitter';
import { DBService } from '@2pm/core/db';

@WebSocketGateway({
  namespace: '/environments',
  cors: { origin: '*' },
})
export abstract class BaseGateway {
  @Inject('E') protected readonly events: AppEventEmitter;
  @Inject('DB') protected readonly db: DBService;

  async getUser(humanUserId: HumanUser['id']) {
    const user = await this.db.humanUsers.find(humanUserId);

    if (!user) {
      throw new Error();
    }

    return user;
  }

  async getUserTag(humanUserId: HumanUser['id']) {
    const user = await this.getUser(humanUserId);
    return this.formatUser(user);
  }

  async formatUser(user: HumanUserDto) {
    const name =
      user.type === 'ANONYMOUS'
        ? `@anon#${user.data.hash}`
        : `@${user.data.tag}`;

    return name;
  }
}
