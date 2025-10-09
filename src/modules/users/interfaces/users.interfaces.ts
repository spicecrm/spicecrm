export interface apiKeyI {
    id: string;
    expire_on: string;
    valid_for_months?: string;
    created_by_id: string;
    created_by_name: string;
    date_entered: string;
    user_id: string;
    is_active: 1 | 0;
}