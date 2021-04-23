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
    notification_type: 'assign' | 'delete' | 'change';
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
