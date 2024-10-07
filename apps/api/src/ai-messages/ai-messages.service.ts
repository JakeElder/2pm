import DBService from '@2pm/db';
import { AiMessageDto } from '@2pm/data/dtos';
import {
  aiMessages,
  aiUsers,
  environments,
  messages,
  plotPointMessages,
  plotPoints,
  users,
} from '@2pm/data/schema';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class AiMessagesService {
  constructor(@Inject('DB') private readonly db: DBService) {}
}
