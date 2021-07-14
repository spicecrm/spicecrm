/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Observable} from "rxjs";

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

/**
 * holds the socket service received event data interface
 */
export interface SocketEventDataI {
    message: {
        module?: string,
        id?: string,
        sessionId: string,
        error?: string
    };
    type: 'error' | 'message';
}

/**
 * holds the socket service socket object interface
 */
export interface SocketEventI {
    type: string;
    data?: any;
}

/**
 * holds the socket service socket object interface
 */
export interface SocketObjectI {
    instance: any;
    isConnected: () => boolean;
    event$: Observable<SocketEventI>;
    /**
     * holds the joined rooms.
     * the key is the name of the room and the number is the number of the room participants in the current instance
     */
    rooms: {
        [key: string]: number
    };
}

/**
 * holds the notification object interface
 */
export interface NotificationI {
    id: string;
    bean_module: string;
    bean_id: string;
    created_by: string;
    created_by_name: string;
    user_id: string;
    notification_date: string;
    notification_type: 'generic' | 'assign' | 'delete' | 'change' |'reminder';
    notification_read: 1 | 0;
    additional_infos: {
        fieldsNames: string[]
    } | any;
    bean_name: string;
}
/**
 * holds the subscription object interface
 */
export interface SubscriptionI {
    user_id: string;
    bean_id: string;
    bean_module: string;
}
