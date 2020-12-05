# nodejs-aws-be

##### Create service
serverless create --template aws-nodejs-typescript --path product-shop-service
<!-- serverless create --template aws-nodejs --path product-service -->

##### Debug
serverless invoke local --function getProductsList
serverless invoke local --function createProduct --path ./mocks/createProductEvent.json

##### Deploy
cd product-service
serverless deploy OR [sls deploy -f function-name]


##### Docker
FROM node:12 as build [FROM node:12-alpine]
COPY
ADD
RUN npm run lint
ENTRYPOINT
CMD
##### Docker Example
FROM node:12-alpine
COPY index.js ./
COPY package.json ./
COPY package-lock.json ./
RUN npm install
ENTRYPOINT ["node", "index.js"]
