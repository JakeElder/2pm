import { Controller, Get, Route, Tags } from "tsoa";
import prisma from "@/db";
import { Actor } from "@2pm/data";

@Route("actors")
@Tags("Actor")
export class ActorController extends Controller {
  @Get("/")
  public async getActors(): Promise<Actor[]> {
    return prisma.actor.findMany();
  }
}
