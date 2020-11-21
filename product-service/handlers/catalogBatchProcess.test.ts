import { catalogBatchProcess } from './catalogBatchProcess'
import { Client } from 'pg'
import { SQSEvent } from 'aws-lambda'

jest.mock('pg', () => ({ Client: jest.fn(() => ({
    connect: jest.fn(),
    query: jest.fn().mockImplementation(() => {
        return Promise.resolve({ rows: [{ id: 'c6bb11e1-a56c-4d46-82a2-b8b93c99d27c', title: 'Node.js Web Development' }] })
    }),
    end: jest.fn()
})) }))

jest.mock('aws-sdk', () => ({
    SNS: jest.fn(() => ({
        publish: () => ({
            promise: jest.fn()
        })
    }))
}))

describe('catalogBatchProcess tests', () => {
  let client

  beforeEach(() => {
    client = new Client()
  })

  test('should log error due to passed invalid product', async () => {
    const logErrorSpy = jest.spyOn(console, 'error')
    const body = JSON.stringify({ description: 'description' })

    await catalogBatchProcess({ Records: [{ body }] } as SQSEvent, null, null)
    expect(logErrorSpy).toHaveBeenCalledWith('Invalid product')
  })

  test('should create a new product', async () => {
    const logSpy = jest.spyOn(console, 'log')
    const body = JSON.stringify({ title: 'title', description: 'description', count: 10, price: 10 })

    await catalogBatchProcess({ Records: [{ body }] } as SQSEvent, null, null)
    expect(logSpy).toHaveBeenCalledWith('DB: product has been created')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
