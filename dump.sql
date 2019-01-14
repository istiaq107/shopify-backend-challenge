-- -------------------------------------------------------------
-- TablePlus 1.0(170)
--
-- https://tableplus.com/
--
-- Database: store
-- Generation Time: 2019-01-14 16:47:08.7530
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."users";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence
CREATE SEQUENCE IF NOT EXISTS "public"."users_id_seq";

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "username" varchar NOT NULL DEFAULT ''::character varying,
    "password_hash" text NOT NULL,
    "cart_items" json NOT NULL DEFAULT '{}'::json,
    "cart_subtotal" float4 NOT NULL DEFAULT 0.0,
    "seller_status" bool NOT NULL DEFAULT false,
    PRIMARY KEY ("id")
);;

DROP TABLE IF EXISTS "public"."products";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence
CREATE SEQUENCE IF NOT EXISTS "public"."products_id_seq";

-- Table Definition
CREATE TABLE "public"."products" (
    "id" int4 NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    "title" text NOT NULL DEFAULT ''::text,
    "price" float4 NOT NULL DEFAULT 0.0,
    "inventory_count" int4 NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
);;

DROP TABLE IF EXISTS "public"."carts";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence
CREATE SEQUENCE IF NOT EXISTS "public"."carts_id_seq";

-- Table Definition
CREATE TABLE "public"."carts" (
    "id" int4 NOT NULL DEFAULT nextval('carts_id_seq'::regclass),
    "cart_items" json NOT NULL DEFAULT '{}'::json,
    "cart_subtotal" float4 NOT NULL DEFAULT 0.0,
    PRIMARY KEY ("id")
);;

INSERT INTO "public"."carts" ("id", "cart_items", "cart_subtotal") VALUES ('1', '{}', '0'),
('2', '{}', '0'),
('3', '{}', '0'),
('4', '{"watch":3}', '750');

INSERT INTO "public"."products" ("id", "title", "price", "inventory_count") VALUES ('10', 'watch', '250', '250'),
('11', 'shades', '70', '250'),
('13', 'wallet', '35', '250'),
('14', 'hat', '30', '5'),
('15', 'belt', '45', '0');

INSERT INTO "public"."users" ("id", "username", "password_hash", "cart_items", "cart_subtotal", "seller_status") VALUES ('18', 'seller_1', '$2b$10$ZzrLZwpCiUhGjUxn4HDiDeHOXoJ0emam9o.6njRrt5fpq2HcxAv9W', '{}', '0', 't'),
('19', 'seller_2', '$2b$10$WvhIVBV5.dekW2h.zZKMcOENc2/8Yq305lbvFJrFSu3SIFQkQhXwa', '{}', '0', 't'),
('20', 'seller_3', '$2b$10$WOHDPJ4mudtymo/iv0lbDO11ld630v7sKX..fZ5zdAXvxdV33Q/uO', '{}', '0', 't'),
('21', 'buyer_1', '$2b$10$fUiD8JqgJwXRgXvUEZqkpe6GaR/MV6e0kgGKUW7KOOKRVoDe82WIS', '{}', '0', 'f'),
('22', 'buyer_2', '$2b$10$gh/cvambYA2P6GeRDmM1SukM9yE7DW5oqhPztC0CPputMw4JhQLl.', '{}', '0', 'f'),
('23', 'buyer_3', '$2b$10$BSR/QBNpq8SOpPGqMXYcX.wyhC/IJQ0hcY67xai6s4eoXum8ttRne', '{}', '0', 'f'),
('24', 'user_1', '$2b$10$GGHcPdnLy..VmM3BwkiWFuU3cdu21JU9JsREYYPJ6C6hbnc.9SG9.', '{}', '0', 'f');

