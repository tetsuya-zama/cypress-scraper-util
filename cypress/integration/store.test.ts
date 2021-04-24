import {isTStoreRequests, TStoreRequests} from '../../src';
import path from 'path';

const store = (req: TStoreRequests) => cy.task('store',req);

describe('store task', () => {
    it('stores value as file', () => {
        store({
            type: 'string',
            to: path.join(__dirname, '../downloads/test-string.txt'),
            value: 'test'
        });

        store({
            type: 'string',
            to: path.join(__dirname, '../downloads/test-json.json'),
            value: {message: 'this is test'}
        });

        store({
            type: 'http-get',
            to: path.join(__dirname, '../downloads/watch.png'),
            value: 'https://homepages.cae.wisc.edu/~ece533/images/watch.png'
        });
    })
})