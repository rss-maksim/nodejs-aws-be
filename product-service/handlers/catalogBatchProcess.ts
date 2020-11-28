import { SQSEvent, SQSHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { Client } from 'pg'

import { toError } from '../../core/response'
import { ProductSchema } from './schemas/productSchema'
import { dbOptions } from './dbOprions'
import { insertStockQuery } from './queries/stock'
import { insertProductQuery } from './queries/products'

// @ts-ignore
export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  if (!event.Records) {
    return
  }
  const sns = new AWS.SNS({ region: 'eu-west-1' })

  const client = new Client(dbOptions)
  try {
    await client.connect()

    const promises = event.Records.map(async ({ body }: any) => {
      try {
        const castedBody = ProductSchema.cast(body)
        const isValid = await ProductSchema.isValid(castedBody)

        if (!isValid) {
          console.error('Invalid product')
          return
        }
        const { title, count, description, price, published, edition, publisher, authors, cover_url, rating } = castedBody
        const values = [title, description, price, published, edition, publisher, authors, cover_url, rating]

        const { rows: products } = await client.query(insertProductQuery, values)
        const [product] = products

        await client.query(insertStockQuery, [product.id, count])

        console.log('DB: product has been created')

        return { ...product, count }
      } catch (error) {
        console.error(error)
      } finally {
        client.end()
      }
    })

    if (!promises.length) {
        console.log('Products have not been created')
    }

    const products = await Promise.all(promises)

    const threshold = 30
    const cheapProducts = products.filter((product) => product.price < threshold)
    const expensiveProducts = products.filter((product) => product.price >= threshold)

    if (expensiveProducts.length) {
        await sns.publish(
            {
              Subject: 'New expensive products have been added to the store',
              Message: JSON.stringify(expensiveProducts),
              TopicArn: process.env.SNS_ARN,
              MessageAttributes: {
                type: {
                    DataType: 'String',
                    StringValue: 'expensive'
                }
              },
            },
            (error) => {
              console.log('catalogBatchProcess: publish expensive', { error, expensiveProducts })
            }
          ).promise()
    }

    if (cheapProducts.length) {
        await sns.publish(
            {
              Subject: 'New cheap products have been added to the store',
              Message: JSON.stringify(cheapProducts),
              TopicArn: process.env.SNS_ARN,
              MessageAttributes: {
                price: {
                    DataType: 'Number',
                    StringValue: '29.99'
                }
              },
            },
            (error) => {
              console.log('catalogBatchProcess: publish cheap', { error, cheapProducts })
            }
          ).promise()
    }

  } catch {
    return toError('Server Error', { statusCode: 500 })
  }
}
