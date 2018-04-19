-- Adminer 4.6.2 PostgreSQL dump

\connect "veilleur";

DROP TABLE IF EXISTS "processed_slack_message";
CREATE TABLE "public"."processed_slack_message" (
    "id" integer NOT NULL,
    "date" timestamp(0) NOT NULL,
    CONSTRAINT "processed_slack_message_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "tag";
CREATE TABLE "public"."tag" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    CONSTRAINT "tag_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "uniq_389b7835e237e06" UNIQUE ("name")
) WITH (oids = false);

CREATE INDEX "name_idx" ON "public"."tag" USING btree ("name");


DROP TABLE IF EXISTS "watch_link";
CREATE TABLE "public"."watch_link" (
    "id" integer NOT NULL,
    "description" character varying(255),
    "image" character varying(1024),
    "name" character varying(255),
    "url" character varying(1024) NOT NULL,
    "created_at" timestamp(0) NOT NULL,
    "overridden" boolean DEFAULT false NOT NULL,
    CONSTRAINT "watch_link_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "created_at_idx" ON "public"."watch_link" USING btree ("created_at");

CREATE INDEX "url_idx" ON "public"."watch_link" USING btree ("url");


DROP TABLE IF EXISTS "watch_link_tag";
CREATE TABLE "public"."watch_link_tag" (
    "watch_link_id" integer NOT NULL,
    "tag_id" integer NOT NULL,
    CONSTRAINT "watch_link_tag_pkey" PRIMARY KEY ("watch_link_id", "tag_id"),
    CONSTRAINT "fk_260d06d9545a9de2" FOREIGN KEY (watch_link_id) REFERENCES watch_link(id) NOT DEFERRABLE,
    CONSTRAINT "fk_260d06d9bad26311" FOREIGN KEY (tag_id) REFERENCES tag(id) NOT DEFERRABLE
) WITH (oids = false);

CREATE INDEX "idx_260d06d9545a9de2" ON "public"."watch_link_tag" USING btree ("watch_link_id");

CREATE INDEX "idx_260d06d9bad26311" ON "public"."watch_link_tag" USING btree ("tag_id");


-- 2018-04-19 08:06:39.140805+00

