import { APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'

import { toSuccess, toError } from '../../core/response'
import { Bucket } from './const'

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
    console.log('queryStringParameters', event.queryStringParameters)
    const name = event.queryStringParameters?.name
    if (!name) {
        return toError('Bad Request', { statusCode: 400 })
    }
    const path = `uploaded/${name}`

    const s3 = new AWS.S3({ region: 'eu-west-1', signatureVersion: 'v4' })

    const params = {
        Bucket,
        Key: path,
        Expires: 60,
        ContentType: 'text/csv'
    }
    
    try {
        const url: string = await s3.getSignedUrlPromise('putObject', params)
        return toSuccess(url)
    } catch(error) {
        return toError('Server Error', { statusCode: 500 })
    }
}
