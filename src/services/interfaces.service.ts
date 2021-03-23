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

/**
 * holds the list data object interface
 */
export interface listDataI {
    list: any[];
    totalcount: number;
    source?: 'fts' | 'db';
}

/**
 * holds the module custom list interface
 */
export interface ListTypeI {
    id: string;
    created_by?: string;
    module?: string;
    name?: string;
    listcomponent?: string;
    global?: '0' | '1';
    basefilter?: string;
    fielddefs?: string;
    filterdefs?: string;
    aggregates?: string;
    sortfields?: string;
    date_last_used?: string;
    icon?: string;
}

/**
 * holds the geo search object interface
 */
export interface geoSearch {
    radius: number;
    lat: number;
    lng: number;
}

/**
 * refines an interface for the relate filter
 * this can be used to limit results to relationships
 * used in modellist service
 */
export interface relateFilter {
    module: string;
    relationship: string;
    id: string;
    display: string;
    active: boolean;
    required: boolean;
}

/**
 * holds interface for a bucket object which
 * used in modellist service
 */
export interface BucketsI {
    bucketfield?: string;
    bucketitems?: any[];
    buckettotal?: any[];
}
