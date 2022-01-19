export interface WorkflowTaskTypeI {
    id: string;
    name: string;
    frontend_component: string;
    admin_component: string;
    handler_class: string;
    type: 'regular' | 'gateway_event_based' | 'gateway_decision';
    deleted: boolean;
}
