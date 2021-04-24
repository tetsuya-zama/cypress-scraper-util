import {store, isTStoreRequests} from './keepers';
export * from './keepers';

export type TOn = (symbol: string, arg: {[key:string]: Function}) => void;

export function installPlugin(on: TOn, taskName: string = 'store'): void{
    on('task', 
        {
            [taskName]: async (payload: any) => {
                if(isTStoreRequests(payload)){
                    return await store(payload);
                }
            
                throw new Error(`Invalid ${taskName} request: ${JSON.stringify(payload)}`);
            }
        }
    );
}