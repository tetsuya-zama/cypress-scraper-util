import {TStoreRequests} from '../../src';

const store = (req: TStoreRequests) => cy.task('store',req);

describe("s3 storing test", () => {
    it("stores value as s3 object", () => {
        const bucket = Cypress.env("TEST_S3_BUCKET");

        store({
            type: 'string',
            to: `s3://${bucket}/string/test-string.txt`,
            value: 'test'
        });

        store({
            type: 'string',
            to: `s3://${bucket}/object/test-json.json`,
            value: {message: 'this is test'}
        });

        store({
            type: 'http-get',
            to: `s3://${bucket}/file/watch.png`,
            value: 'https://homepages.cae.wisc.edu/~ece533/images/watch.png'
        });
    })
})