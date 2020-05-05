/**
 * @module services
 */

export interface telephonyCallI {
    id: string;
    callid?: string;
    status: 'initial' | 'connecting' | 'ringing' | 'connected' | 'disconnected' | 'error';
    msisdn: string;
    direction: 'outbound' | 'inbound';
    relatedmodule?: string;
    relatedid?: string;
    relateddata?: any;
}
