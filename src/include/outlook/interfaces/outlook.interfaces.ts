/**
 * @module Outlook
 */

export interface outlookNameValuePairI {
    name: string;
    value: string;
}

export interface OutlookAttachmentI {
    attachmentToken: string;
    ewsUrl: string;
    attachments: any[];
}
