import {APIGatewayProxyHandler} from "aws-lambda"

import { getProductById } from "../service/productsService"
import { toSuccess, toError } from "./response"

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
    const { pathParameters } = event
    const { productId } = pathParameters
    
    try {
        if (!productId) {
            throw new Error('Not found')
        }
        const product = await getProductById(productId)
        if (!product) {
            return toError('Not found')
        }
        return toSuccess(product)
    } catch {
        return toError('Not found')
    }
}
