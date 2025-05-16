export interface ACLModule {
    id: string;
    module: string;
    scope: 'g'|'c';
    usagecount: number;
}
export interface ACLAction {
    id: string;
    sysmodule_id: string;
    scope: 'g'|'c';
    action?: string;
    description?: string;
    package?: string;
    version?: string;
}
export interface ACLField {
    id: string;
    sysmodule_id: string;
    scope: 'g'|'c';
    name?: string;
    package?: string;
    version?: string;
}

export interface ACLType {
    acltype: ACLModule,
    aclactions: ACLAction[],
    aclfields: ACLField[]
}