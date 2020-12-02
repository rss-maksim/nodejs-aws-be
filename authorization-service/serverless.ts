import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'authorization-service'
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: {
        forceExclude: 'aws-sdk',
      }
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      rss_maksim: '${env:rss_maksim}',
    },
  },
  functions: {
    basicAuthorizer: {
      handler: 'handler.basicAuthorizer'
    }
  },
  resources: {
    Resources: {

    },
    Outputs: {
      basicAuthorizerArn: {
        Value: {
          'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn']
        },
        Export: {
          Name: 'basicAuthorizerArn'
        }
      }
    }
  }
}

module.exports = serverlessConfiguration;
