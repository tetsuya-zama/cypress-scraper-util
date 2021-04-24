import cypress from 'cypress';
import fs from 'fs';
import path from 'path';
import {expect} from '@jest/globals';

const downloadPath = path.join(__dirname, '../cypress/downloads');

describe('cypress integration', () =>{
    it('run test with cypress', async () => {
        await fs.promises.rm(downloadPath, {recursive: true, force: true});
        await cypress.run({record: false, config: {video: false}});
        expect(fs.existsSync(`${downloadPath}/test-string.txt`)).toBe(true);
        expect(fs.existsSync(`${downloadPath}/test-json.json`)).toBe(true);
        expect(fs.existsSync(`${downloadPath}/watch.png`)).toBe(true);
    })
})