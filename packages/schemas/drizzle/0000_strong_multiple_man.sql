DO $$ BEGIN
 CREATE TYPE "public"."ActorType" AS ENUM('HUMAN', 'AI');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "actors" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"type" "ActorType" NOT NULL
);
