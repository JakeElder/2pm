import { PlotPointSchema } from '@2pm/schemas';
import { createZodDto } from '@anatine/zod-nestjs';

export class PlotPointDto extends createZodDto(PlotPointSchema) {}
