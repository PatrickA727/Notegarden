ALTER TABLE "sync_request" DROP CONSTRAINT "sync_request_pkey";--> statement-breakpoint
ALTER TABLE "sync_request" ADD CONSTRAINT "sync_request_user_id_request_id_pk" PRIMARY KEY("user_id","request_id");
