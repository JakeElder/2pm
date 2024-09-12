import { Inject, Injectable } from '@nestjs/common';
import type { DB } from '@2pm/schemas';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@Injectable()
export class ActorsService {
  constructor(@Inject('DB') private db: DB) {}

  create(createActorDto: CreateActorDto) {
    return 'This action adds a new actor';
  }

  async findAll() {
    const actors = await this.db.query.actors.findMany();
    return actors;
  }

  findOne(id: number) {
    return `This action returns a #${id} actor`;
  }

  update(id: number, updateActorDto: UpdateActorDto) {
    return `This action updates a #${id} actor`;
  }

  remove(id: number) {
    return `This action removes a #${id} actor`;
  }
}
