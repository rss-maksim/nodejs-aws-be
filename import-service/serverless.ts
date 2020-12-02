import type { Serverless } from 'serverless/aws'

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service'
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: {
        forceExclude: 'aws-sdk'
      }
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {
        'Fn::ImportValue': 'SQSQueueUrl'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: ['arn:aws:s3:::rss-book-store-bucket']
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: ['arn:aws:s3:::rss-book-store-bucket/*']
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: ['${cf:product-service-${self:provider.stage}.SQSQueueArn}']
      }
    ]
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            },
            authorizer: {
              name: 'basicAuthorizer',
              // @ts-ignore
              arn: {
                'Fn::ImportValue': 'basicAuthorizerArn'
              },
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'token'
            }
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: 'rss-book-store-bucket',
            event: 's3:ObjectCreated:*',
            rules: [{ prefix: 'uploaded/', suffix: '' }],
            existing: true
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,OPTIONS'"
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          }
        }
      },
      GatewayResponseAccessDenied: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Credentials': "'true'",
            'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,OPTIONS'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'"
          },
          ResponseType: 'ACCESS_DENIED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          }
        }
      },
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Credentials': "'true'",
            'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,OPTIONS'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'"
          },
          ResponseType: 'UNAUTHORIZED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          }
        }
      }
    }
  }
}

module.exports = serverlessConfiguration
