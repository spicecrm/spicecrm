/**
 * holds the notification object interface
 */
export interface NavigationI {
    id: string;
    bean_module: string;
    bean_id: string;
    user_id: string;
    created_by: string;
    notification_date: string;
    notification_type: 'assignment' | null;
    notification_read: 1 | 0;
    notification_text: string;
    deleted: 1 | 0;
}
