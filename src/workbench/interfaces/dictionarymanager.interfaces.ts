/**
 * the dictionaryItems
 */
export interface DictionaryDefinition {
    id: string;
    name: string;
    scope: 'c'|'g';
    status: 'd'|'a'|'i';
    tablename: string;
    sysdictionary_type: string;
    description?: string;
    deleted: number;
    version?: string;
    package?: string;
}

/**
 * the dictionaryItems
 */
export interface DictionaryItem {
    id: string;
    name: string;
    scope: 'c'|'g';
    status: 'd'|'a'|'i';
    sequence: number;
    sysdictionarydefinition_id: string;
    sysdictionary_ref_id?: string;
    sysdomaindefinition_id?: string;
    label?: string;
    non_db: number;
    exclude_from_audited: number;
    required: number;
    default_value?: string;
    field_comment?: string;
    description?: string;
    deleted: number;
    version?: string;
    package?: string;
}

/**
 * the Relationship
 */
export interface Relationship {
    id: string;
    name: string;
    scope: 'c'|'g';
    status: 'd'|'a'|'i';
    relationship_name: string;
    lhs_sysdictonarydefinition_id: string;
    lhs_sysdictionaryitem_id: string;
    lhs_linkname: string;
    rhs_sysdictonarydefinition_id: string;
    rhs_sysdictionaryitem_id: string;
    rhs_linkname: string;
    rhs_realname: string;
    relationship_type: 'one-to-many'|'many-to-many'|'parent';
    deleted: number;
    version?: string;
    package?: string;
}

/**
 * the relationship relate fields
 */
export interface RelationshipRelateField {
    id: string;
    scope: 'c'|'g';
    status: 'd'|'a'|'i';
    relationship_id: string;
    sysdictionaryitem_id: string;
    deleted: number;
}

/**
 * the dictionaryIndex
 */
export interface DictionaryIndex {
    id: string;
    name: string;
    scope: 'c'|'g';
    status: 'd'|'a'|'i';
    sysdictionarydefinition_id: string;
    indextype: 'primary'|'index'|'unique';
    description?: string;
    deleted: number;
    version?: string;
    package?: string;
}

/**
 * the dictionaryIndexItems
 */
export interface DictionaryIndexItem {
    id: string;
    scope: 'c'|'g';
    status: 'd'|'a'|'i';
    sysdictionaryindex_id: string;
    sysdictionaryitem_id: string;
    sequence: number;
    deleted: number;
    version?: string;
    package?: string;
}
