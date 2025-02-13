ALTER TABLE "usergames" ALTER COLUMN "play_time" DROP NOT NULL;
UPDATE "usergames" SET "play_time"=NULL where "success"='f';