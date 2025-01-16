CREATE TABLE "scenarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usergames" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"scenario_id" integer NOT NULL,
	"play_time" interval NOT NULL,
	"success" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usergames" ADD CONSTRAINT "usergames_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usergames" ADD CONSTRAINT "usergames_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id") ON DELETE cascade ON UPDATE no action;