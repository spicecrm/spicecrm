
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
    len?: number;
    required: number;
    label?: string;
    exclude_from_index: number;
    sysdomaindefinition_id: string;
    sysdomainfieldvalidation_id: string;
    sequence: number;
    fieldtype?: string;
    description?: string;
    version?: string;
    package?: string;
    defined?:boolean;
    cached?:boolean;
    database?:boolean;
}

/**
 * the validation
 */
export interface DomainValidation {
    id: string;
    name: string;
    scope: 'c'|'g';
    status: 'd'|'a'|'i';
    validation_type: string;
    sort_flag: 'asc'|'desc';
    order_by: 'sequence' | 'enumvalue' | 'label';
    description?: string;
    version?: string;
    package?: string;
    validationvalues?: {[key: string]: DomainValidationValue};
}

/**
 * the validation
 */
export interface DomainValidationValue {
    id: string;
    sysdomainfieldvalidation_id: string;
    enumvalue: string;
    scope: 'c'|'g';
    status: 'd'|'a'|'i';
    valuetype: 'string'|'integer';
    sequence?: number;
    label?: string;
    description?: string;
    version?: string;
    package?: string;
}