import cypress from 'cypress';
import fs from 'fs';
import path from 'path';
import {expect} from '@jest/globals';
import {S3} from 'aws-sdk';

const downloadPath = path.join(__dirname, '../cypress/downloads');
const testBucket = "tetsuya.zama.cypress-scraper-util.test-bucket";

describe('cypress integration', () =>{
    it('run test with cypress', async () => {
        await fs.promises.rm(downloadPath, {recursive: true, force: true});
        const s3client = new S3();
        const objectsInTestBucket = await s3client.listObjectsV2({Bucket:testBucket}).promise();
        if(objectsInTestBucket.Contents){
            await Promise.all(objectsInTestBucket.Contents.map(obj => obj.Key).filter((key): key is string => !!key).map(key => s3client.deleteObject({Bucket: testBucket, Key: key}).promise()));
        }
        

        await cypress.run(
            {
                record: false, 
                config: {video: false},
                env: {
                    "TEST_S3_BUCKET": testBucket
                }
            });
        expect(fs.existsSync(`${downloadPath}/test-string.txt`)).toBe(true);
        expect(fs.existsSync(`${downloadPath}/test-json.json`)).toBe(true);
        expect(fs.existsSync(`${downloadPath}/watch.png`)).toBe(true);

        const objectsResult = await s3client.listObjectsV2({Bucket:testBucket}).promise();
        const resultKeys = objectsResult.Contents?.map(obj => obj.Key).filter((key): key is string => !!key);
        expect(resultKeys).toContain("string/test-string.txt");
        expect(resultKeys).toContain("object/test-json.json");
        expect(resultKeys).toContain("file/watch.png");

    })
})