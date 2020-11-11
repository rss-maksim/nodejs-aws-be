import { APIGatewayProxyHandler } from 'aws-lambda'
import { Client } from 'pg'

import { toSuccess, toError } from './response'
import { dbOptions } from './dbOprions'
import { selectProductsQuery } from './queries/products'

export const getProductsList: APIGatewayProxyHandler = async (event) => {
    console.log('Incoming Event', event)
    
    const client = new Client(dbOptions) 
    try {
        await client.connect()
        const { rows: products } = await client.query(selectProductsQuery)
        return toSuccess(products)
    } catch {
        return toError('Server Error', { statusCode: 500 })
    } finally {
        client.end()
    }
}
