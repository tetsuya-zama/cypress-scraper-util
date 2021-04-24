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

async function storeString({value, to}: StringStoreRequest): Promise<void>{
    await writeFileWithDir(to, typeof value === 'string' ? value : JSON.stringify(value));
}

import fecth from 'node-fetch';

async function storeGetRequest({value, to}: HttpGetStoreRequest): Promise<void>{
    const res = await fecth(value);
    const buf = await res.buffer();
    await writeFileWithDir(to, buf);
}



