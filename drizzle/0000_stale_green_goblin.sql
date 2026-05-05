CREATE TABLE "searches" (
	"id" serial PRIMARY KEY NOT NULL,
	"input_type" varchar(20) NOT NULL,
	"input_value" text NOT NULL,
	"decimal_result" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
