import {APIGatewayProxyHandler} from 'aws-lambda'
import { Client } from 'pg'

import { toSuccess, toError } from '../../core/response'
import { dbOptions } from './dbOprions'
import { selectProductByIdQuery } from './queries/products'

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
    const { pathParameters } = event
    const { productId } = pathParameters

    console.log('Incoming Event', { event, pathParameters, _context })

    if (!productId) {
        return toError('Not found')
    }
    
    const client = new Client(dbOptions) 
    try {
        await client.connect()
        const { rows: products } = await client.query(selectProductByIdQuery, [productId])
        
        if (products.length === 0) {
            throw new Error('Not found')
        }
        return toSuccess(products[0])
    } catch {
        return toError('Server Error', { statusCode: 500 })
    } finally {
        client.end()
    }
}
