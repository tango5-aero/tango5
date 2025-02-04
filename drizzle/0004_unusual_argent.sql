ALTER TABLE "scenarios" ADD COLUMN "active" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "scenarios" DROP COLUMN "release_date";