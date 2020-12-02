import { APIGatewayAuthorizerHandler, APIGatewayAuthorizerResultContext, Callback, APIGatewayAuthorizerResult } from 'aws-lambda';
import 'source-map-support/register';

enum Effect {
    Deny = 'Deny',
    Allow = 'Allow'
}

const generatePolicy = (principalId, resource, effect = Effect.Allow) => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }
        ]
    }
})

// @ts-ignore
export const basicAuthorizer: APIGatewayAuthorizerHandler= async (event: APIGatewayProxyWithLambdaAuthorizerEvent, context: APIGatewayAuthorizerResultContext, callback: Callback<APIGatewayAuthorizerResult>) => {
    console.log('basicAuthorizer event:', event)

    if (event.type !== 'TOKEN') {
        callback('Unauthorized')
    }

    try {
        const { authorizationToken } = event
        const encodedCreds = authorizationToken.split(' ')[1]
        const buff = Buffer.from(encodedCreds, 'base64')
        const plainCreds = buff.toString('utf-8').split(':')
        const [username, password] = plainCreds

        if (!username || !password) {
            callback('Unauthorized')
        }

        const realUserPassword = process.env[username]
        const effect = !realUserPassword || realUserPassword !== password ? Effect.Deny : Effect.Allow
        const policy = generatePolicy(encodedCreds, event.methodArn, effect)
        console.log('creds:', { username, password, realUserPassword, policy: JSON.stringify(policy) })

        callback(null, policy)

    } catch(e) {
        callback('Unauthorized')
    }
}
