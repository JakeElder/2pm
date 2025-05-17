import { eq } from "drizzle-orm";
import {
  environments,
  paliCanonReferences,
  plotPointPaliCanonReferences,
  plotPoints,
} from "../../db/app.schema";
import { DBServiceModule } from "../../db/db-service-module";
import { CreatePaliCanonReferenceDto } from "./pali-canon-reference.dto";
import {
  PaliCanonReferencePlotPointDto,
  PaliCanonReferencePlotPointDtoSchema,
} from "../plot-point";
import { paliCanonChunks } from "../../db/library.schema";

export default class PaliCanonReferences extends DBServiceModule {
  public async create({
    userId,
    environmentId,
    paliCanonChunkId,
  }: CreatePaliCanonReferenceDto): Promise<
    PaliCanonReferencePlotPointDto["data"]
  > {
    const [environment] = await this.app.drizzle
      .select()
      .from(environments)
      .where(eq(environments.id, environmentId))
      .limit(1);

    const [paliCanonChunk] = await this.library.drizzle
      .select()
      .from(paliCanonChunks)
      .where(eq(paliCanonChunks.id, paliCanonChunkId));

    if (!environment || !paliCanonChunk) {
      throw new Error();
    }

    const { plotPoint } = await this.app.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ type: "PALI_CANON_REFERENCE", environmentId, userId })
        .returning();

      const [paliCanonReference] = await tx
        .insert(paliCanonReferences)
        .values({ paliCanonChunkId })
        .returning();

      await tx.insert(plotPointPaliCanonReferences).values({
        paliCanonReferenceId: paliCanonReference.id,
        plotPointId: plotPoint.id,
      });

      return { plotPoint };
    });

    const res: PaliCanonReferencePlotPointDto["data"] = {
      environment,
      plotPoint,
      paliCanonChunk,
    };

    return PaliCanonReferencePlotPointDtoSchema.shape.data.parse(res);
  }
}
