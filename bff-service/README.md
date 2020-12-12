## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Create abd deploy
eb init rss-maksim-bff-api2 --platform node.js --region eu-west-1

eb create development --single --cname rss-maksim-bff-api-dev2 --envvars NODE_ENV=production,PORT=5000,PRODUCTS_SERVICE_URL=https://uzg1hf1fba.execute-api.eu-west-1.amazonaws.com/dev,CART_SERVICE_URL=http://rss-maksim-cart-api-dev2.eu-west-1.elasticbeanstalk.com

eb deploy develop --region eu-west-1

