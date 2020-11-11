export const insertStockQuery = `
    INSERT INTO stocks(product_id, count)
    VALUES ($1, $2)
`