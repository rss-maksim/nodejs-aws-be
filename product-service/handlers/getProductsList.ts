import { APIGatewayProxyHandler } from "aws-lambda"

import { getProducts } from "../service/productsService"
import { toSuccess, toError } from "./response"

export const getProductsList: APIGatewayProxyHandler = async () => {
    try {
        const products = await getProducts()
        return toSuccess(products)
    } catch {
        return toError('Bad request', { statusCode: 400 })
    }
}
