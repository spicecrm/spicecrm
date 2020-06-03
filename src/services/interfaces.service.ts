/**
 * @module services
 */


export interface telephonyCallI {
    id: string;
    callid?: string;
    status: 'initial' | 'connecting' | 'ringing' | 'connected' | 'disconnected' | 'error';
    msisdn: string;
    direction: 'outbound' | 'inbound';
    start?: any;
    end?: any;
    relatedmodule?: string;
    relatedid?: string;
    relateddata?: any;
    call?: string;
    note?: string;
}
