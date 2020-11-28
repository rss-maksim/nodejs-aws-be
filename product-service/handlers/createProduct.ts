import { APIGatewayProxyHandler } from 'aws-lambda'
import { Client } from 'pg'

import { toSuccess, toError } from '../../core/response'
import { dbOptions } from './dbOprions'
import { insertProductQuery } from './queries/products'
import { ProductSchema } from './schemas/productSchema'
import { insertStockQuery } from './queries/stock'

export const createProduct: APIGatewayProxyHandler = async (event) => {
    console.log('Incoming Event', { event, body: event.body })
    
    let body
    try {
        body = JSON.parse(event.body)
        const isValid = await ProductSchema.isValid(body)
        if (!isValid) {
            throw new Error()
        } 
    } catch {
        return toError('Bad request', { statusCode: 400 })
    }
    
    const {
        title,
        count,
        description,
        price,
        published,
        edition,
        publisher,
        authors,
        cover_url,
        rating
    } = body

    const client = new Client(dbOptions)

    try {
        await client.connect()
        await client.query('BEGIN')
        const { rows: products } = await client.query(insertProductQuery, [title, description, price, published, edition, publisher, authors, cover_url, rating])
        const [product] = products

        await client.query(insertStockQuery, [product.id, count])
        await client.query('COMMIT')

        return toSuccess({ ...product, count }, { statusCode: 201 })
    } catch(error) {
        await client.query('ROLLBACK')
        return toError('Server Error', { statusCode: 500 })
    } finally {
        client.end()
    }
}