# nodejs-aws-be

##### Create service
serverless create --template aws-nodejs-typescript --path product-shop-service
serverless create --template aws-nodejs --path product-service

##### Debug
serverless invoke local --function getProductsList

##### Deploy
cd product-service
serverless deploy OR [sls deploy -f function-name]

