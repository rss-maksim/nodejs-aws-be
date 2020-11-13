import { S3Handler, S3Event, S3EventRecord } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as csv from 'csv-parser'

import { toSuccess, toError } from '../../core/response'
import { Bucket } from './const'

// @ts-ignore
export const importFileParser: S3Handler = (event: S3Event) => {
    console.log('Incoming Event', event)

    const s3 = new AWS.S3({ region: 'eu-west-1', signatureVersion: 'v4' })
    if (!event.Records) {
        return toError('Not Found', { statusCode: 404 })
    }
    
    event.Records
        .filter((record: S3EventRecord) => record?.s3?.object?.size)
        .forEach((record: S3EventRecord) => {
            const key = record.s3.object.key
            const s3Stream = s3.getObject({
                Bucket,
                Key: key
            }).createReadStream()
                
            s3Stream
                .pipe(csv())
                .on('data', (data: any) => console.log(data))
                .on('error', (error) => {
                    console.log('error', error)
                    throw error
                })
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
                    } catch(error) {
                        console.log('Error:', error)
                    }
                })
        });
        return toSuccess({ message: 'Success' }, { statusCode: 202 })
}
