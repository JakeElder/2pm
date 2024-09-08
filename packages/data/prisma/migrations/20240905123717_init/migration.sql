-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('HUMAN', 'AI');

-- CreateTable
CREATE TABLE "actors" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "type" "ActorType" NOT NULL,

    CONSTRAINT "actors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "actors_tag_key" ON "actors"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "channels_code_key" ON "channels"("code");
