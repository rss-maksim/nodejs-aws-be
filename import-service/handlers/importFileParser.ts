import { S3Handler, S3Event, S3EventRecord } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as csv from 'csv-parser'

import { toSuccess, toError } from '../../core/response'
import { Bucket } from './const'

// @ts-ignore
export const importFileParser: S3Handler = async(event: S3Event) => {
    console.log('Incoming Event', event)
    if (!event.Records) {
        return toError('Not Found', { statusCode: 404 })
    }

    const s3 = new AWS.S3({ region: 'eu-west-1', signatureVersion: 'v4' })
    const sqs = new AWS.SQS({ region: 'eu-west-1' })

    const onParseHadler = (data: any) => {
        console.log('onParse', data, process.env.SQS_URL)
        sqs.sendMessage({
            QueueUrl: process.env.SQS_URL,
            MessageBody: JSON.stringify(data)
        }, (error, result) => {
            if (error) {
                console.error(error)
            }
            console.log('Send message for:', { result, data })
        }) 
    }

    const tasks = []
    
    event.Records
        .filter((record: S3EventRecord) => record?.s3?.object?.size)
        .forEach(async (record: S3EventRecord) => {
            const key = record.s3?.object?.key
            const s3Stream = s3.getObject({
                Bucket,
                Key: key
            }).createReadStream()

            const promise = new Promise((resolve, reject) => {
                s3Stream
                .pipe(csv())
                .on('data', onParseHadler)
                .on('error', (error) => reject(error))
                .on('end', async () => {
                    try {
                        await s3.copyObject({
                            Bucket,
                            CopySource: `${Bucket}/${key}`,
                            Key: key.replace('uploaded', 'parsed')
                        }).promise()

                        await s3.deleteObject({
                            Bucket,
                            Key: key
                        }).promise()

                        resolve()
                    } catch(error) {
                        console.log('Error:', error)
                    }
                })
            })

            tasks.push(promise)
        });

        await Promise.all(tasks)
        return toSuccess({ message: 'Success' }, { statusCode: 202 })
}
