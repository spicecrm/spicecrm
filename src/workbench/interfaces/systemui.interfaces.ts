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
    systemdefault: 1|0;
    portaldefault: 1|0;
    showsearch: 1|0;
    showfavorites: 1|0;
    description: string;
    default_dashboard: string;
    default_dashboardset: string,
    version: string;
    package: string;
    scope: 'custom' | 'global';
    scope_icon: string;
    systemTreeDefs: object;
}