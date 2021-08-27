export interface WorkflowTaskType {
    id: string;
    name: string;
    frontend_component: string;
    admin_component: string;
    handler_class: string;
    deleted: boolean;
}
