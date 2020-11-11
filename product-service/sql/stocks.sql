DROP TABLE stocks;

CREATE TABLE stocks (
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
)

INSERT INTO stocks (product_id, count) VALUES
    ('153b9ce2-1dea-427e-81c8-4506ed3846de', 33),
    ('c9b4ad5b-bcc5-41b7-b97a-e711da5b172d', 34),
    ('9b90c473-ba78-4122-90bc-6e978ec413c0', 46),
    ('a30e2e9f-7371-4dbe-a579-c35ac16313f1', 47),
    ('ecad5c57-d5f9-4753-8164-2ff15f34dba5', 22),
    ('bed8943e-6fc4-437e-9d9f-887e7fca0f25', 11),
    ('bfffba84-8fc6-419c-9f3b-2634792cc16f', 45),
    ('7c560401-3e6b-4d77-9e2f-31d5328c1a79', 3);