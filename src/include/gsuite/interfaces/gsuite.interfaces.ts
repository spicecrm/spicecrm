/**
 * @module ModuleGSuite
 */

/**
 * GSuite email object structure
 */
export interface GSuiteMessageI {
    subject: string;
    body: string;
    to: string;
    date: string;
    from: string;
    message_id: string;
    thread_id: string;
}

/**
 * GSuite attachment object structure
 */
export interface GSuiteAttachmentI {
    id: string;
    name: string;
    contentType: string;
    isInline: boolean;
    downloadUrl: string;
    content: string;
}
