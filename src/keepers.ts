export interface StoreRequest{
    type: string,
    value: string | object,
    to: string //file full path
}

export function isStoreRequest(obj: any): obj is StoreRequest{
    return !!obj.type && typeof obj.type === 'string'
        && !!obj.value && (typeof obj.value === 'string' || typeof obj.value === 'object')
        && !!obj.to && typeof obj.to === 'string'
}

export interface HttpGetStoreRequest extends StoreRequest{
    type: 'http-get',
    value: string //as url,
}

export function isHttpGetStoreRequest(obj: any): obj is HttpGetStoreRequest{
    return isStoreRequest(obj) && obj.type === 'http-get' && typeof obj.value === 'string';
}

export interface StringStoreRequest extends StoreRequest {
    type: 'string'
}

export function isStringStoreRequest(obj: any): obj is StringStoreRequest{
    return isStoreRequest(obj) && obj.type === 'string'
}


export type TStoreRequests = HttpGetStoreRequest | StringStoreRequest;

export function isTStoreRequests(obj: any): obj is TStoreRequests{
    return isHttpGetStoreRequest(obj) || isStringStoreRequest(obj);
}

export async function store(req: TStoreRequests): Promise<null>{
    if(isStringStoreRequest(req)) await storeString(req);
    if(isHttpGetStoreRequest(req)) await storeGetRequest(req);

    return null;
}

import {promises as fs} from 'fs';
import path from 'path';

async function writeFileWithDir(filePath: string, value: string | Buffer): Promise<void>{
    await fs.mkdir(path.dirname(filePath), {recursive: true});
    await fs.writeFile(filePath, value);
}

async function storeDataTo(to: string, value: string | Buffer): Promise<void>{
    if(isS3URI(to)){
        return await writeFileToS3(to, value);
    }
    return await writeFileWithDir(to, value);
}

export type S3URI = `s3://${string}/${string}`;
export function isS3URI(s: string): s is S3URI{
    return /s3:\/\/([^\/]+)\/(\S+)/.test(s);
}

function parseS3URI(val: S3URI): {bucket: string, key: string}{
    const m = val.match(/s3:\/\/([^\/]+)\/(\S+)/);
    if(!m) throw new Error(`Invalid S3 URI:${val}`)
    return {
        bucket: m[1],
        key: m[2]
    };
}

import {S3} from 'aws-sdk';

async function writeFileToS3(to: S3URI, value: string | Buffer): Promise<void>{
    const {bucket, key} = parseS3URI(to);
    const client = new S3();
    await client.putObject({
        Body: value,
        Bucket: bucket,
        Key: key
    }).promise();

    return;
}



async function storeString({value, to}: StringStoreRequest): Promise<void>{
    await storeDataTo(to, typeof value === 'string' ? value : JSON.stringify(value));
}

import fecth from 'node-fetch';

async function storeGetRequest({value, to}: HttpGetStoreRequest): Promise<void>{
    const res = await fecth(value);
    const buf = await res.buffer();
    await storeDataTo(to, buf);
}



