export const selectProductByIdQuery = `
    SELECT * FROM products
    JOIN stocks ON stocks.product_id = products.id
    WHERE id = $1 LIMIT 1`

export const selectProductsQuery = `
    SELECT id, count, title, description, price, published, cover_url, rating
    FROM products
    JOIN stocks ON stocks.product_id = products.id;`

export const insertProductQuery = `
    INSERT INTO products(title, description, price, published, edition, publisher, authors, cover_url, rating)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
`