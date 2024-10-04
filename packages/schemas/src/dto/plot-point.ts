import { createSelectSchema } from "drizzle-zod";
import { plotPoints } from "../drizzle/schema";
import { createZodDto } from "@anatine/zod-nestjs";

const PlotPointDtoSchema = createSelectSchema(plotPoints);
class PlotPointDto extends createZodDto(PlotPointDtoSchema) {}
export { PlotPointDtoSchema, PlotPointDto };
