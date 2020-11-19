import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";

import { importProductsFile } from "./importProductsFile";

describe("importProductFile tests", () => {
  const name = "products.csv";

  beforeAll(() => {
    AWSMock.mock("S3", "getSignedUrlPromise", (method, _, callback) => {
      callback(null, {
        data: `https://bucket-name.s3.eu-west-1.amazonaws.com/uploaded/${name}`,
      });
    });
  });

  afterAll(() => {
    AWSMock.restore("S3");
  });

  test("should test importProductsFile handler", async () => {
    const event = { queryStringParameters: { name } };

    await expect(
      // @ts-ignore
      importProductsFile(event, null, null)
    ).resolves.toMatchSnapshot();
  });

  test("should mock getSignedUrlPromise from S3", async () => {
    const s3 = new AWS.S3({ region: "eu-west-1" });
    const path = `uploaded/${name}`;
    const params = {
      Bucket: "rss-book-store-bucket",
      Key: path,
      Expires: 60,
      ContentType: "text/csv",
    };

    await expect(
      s3.getSignedUrlPromise("putObject", params)
    ).resolves.toContain(`s3.eu-west-1.amazonaws.com/uploaded/${name}`);
    await expect(
      s3.getSignedUrlPromise("putObject", params)
    ).resolves.toContain("Signature=");
    await expect(
      s3.getSignedUrlPromise("putObject", params)
    ).resolves.toContain("AWSAccessKeyId=");
  });
});
