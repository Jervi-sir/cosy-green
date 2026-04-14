CREATE TABLE "monitoring_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar(128) NOT NULL,
	"method" varchar(16) NOT NULL,
	"url" text NOT NULL,
	"route_path" varchar(255),
	"status_code" integer NOT NULL,
	"duration_ms" integer NOT NULL,
	"ip" varchar(128),
	"user_agent" text,
	"request_headers" jsonb,
	"query_params" jsonb,
	"route_params" jsonb,
	"request_body" jsonb,
	"response_body" jsonb,
	"error_name" varchar(255),
	"error_message" text,
	"error_stack" text,
	"authenticated_user" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "monitoring_requests_request_id_idx" ON "monitoring_requests" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "monitoring_requests_status_code_idx" ON "monitoring_requests" USING btree ("status_code");--> statement-breakpoint
CREATE INDEX "monitoring_requests_route_path_idx" ON "monitoring_requests" USING btree ("route_path");--> statement-breakpoint
CREATE INDEX "monitoring_requests_created_at_idx" ON "monitoring_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "monitoring_requests_method_created_at_idx" ON "monitoring_requests" USING btree ("method","created_at");