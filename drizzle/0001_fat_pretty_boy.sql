TRUNCATE TABLE "usergames";
ALTER TABLE "usergames" ADD CONSTRAINT "unique_id" UNIQUE("user_id","scenario_id");