export interface RoleModuleI {
    id: string;
    sysuirole_id: string;
    module: string;
    sequence: number;
    version: string;
    package: string;
    scope: 'custom' | 'global';
}

export interface RoleI {
    id: string;
    identifier: string;
    name: string;
    label: string;
    icon: string;
    systemdefault: boolean;
    portaldefault: boolean;
    showsearch: boolean;
    showfavorites: boolean;
    description: string;
    default_dashboard: string;
    default_dashboardset: string,
    version: string;
    package: string;
    scope: 'custom' | 'global';
    scope_icon: string;
    systemTreeDefs: object;
}

export interface LogicHookI {
    id: string;
    module: string;
    event: 'before_relationship_add' | 'after_relationship_add' | 'before_relationship_delete' | 'after_relationship_delete' | 'before_save' | 'after_save' | 'before_retrieve' | 'after_retrieve' | 'before_delete' | 'after_delete' | 'before_restore' | 'after_restore' | 'after_save_completed' | 'before_logout';
    hook_index: number;
    hook_include: string;
    hook_class: string;
    hook_method: string;
    hook_active: 1 | 0;
    description: string;
    version: string;
    package: string;
    type: 'custom' | 'global';
}

export interface WebHookI {
    id: string;
    module: string;
    event: 'create' | 'update' |'delete';
    url: string;
    active: 1 | 0;
    send_data: boolean;
    modulefilter_id: string;
    fieldset_id: string;
    ssl_verifypeer: boolean;
    ssl_verifyhost:boolean;
    custom_headers: string
}