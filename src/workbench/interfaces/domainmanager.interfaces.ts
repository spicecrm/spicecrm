
/**
 * the DomainDefinition
 */
export interface DomainDefinition {
    id: string;
    name: string;
    scope: 'c'|'g';
    status: 'd'|'a'|'i';
    fieldtype: string;
    description?: string;
    deleted: number;
    version?: string;
    package?: string;
}

/**
 * the DomainFields
 */
export interface DomainField {
    id: string;
    name: string;
    scope: 'c'|'g';
    status: 'd'|'a'|'i';
    dbtype: string;
    len: number;
    required: number;
    sysdomaindefinition_id: string;
    sysdomainfieldvalidation_id: string;
    sequence: number;
    fieldtype?: string;
    description?: string;
    deleted: number;
    version?: string;
    package?: string;
}
