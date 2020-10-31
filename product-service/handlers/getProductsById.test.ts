import { getProductsById } from './getProductsById'
import { toSuccess, toError } from './response'

const productMock = {
    count: 46,
    description: "Build scalable web applications using Node.js, Express.js, and the latest ECMAScript techniques, along with deploying applications with AWS and Docker with this updated fifth edition",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
    price: 29.99,
    title: "Node.js Web Development: Server-side web development",
    published: "July 31, 2020",
    edition: 5,
    publisher: "Paperback",
    authors: ["David Herron"],
    coverUrl: "https://images-na.ssl-images-amazon.com/images/I/41e+IedpQXL._SX404_BO1,204,203,200_.jpg",
    rating: 5
}

describe('getProductsById tests', () => {
    const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80a0'

    const response200 = toSuccess(productMock)
    const response404 = toError('Not found', { statusCode: 404 })

    test('should return product by id with statusCode 200', async () => {
        const request = { pathParameters: { productId } }
        // @ts-ignore
        await expect(getProductsById(request)).resolves.toEqual(response200);
    });

    test('should return response with statusCode 404', async () => {
        const request = { pathParameters: { productId: 'fake-id' } }
        // @ts-ignore
        await expect(getProductsById(request)).resolves.toEqual(response404);
    });

    test('should return response with statusCode 404', async () => {
        const request = { pathParameters: {} }
        // @ts-ignore
        await expect(getProductsById(request)).resolves.toEqual(response404);
    });
  });