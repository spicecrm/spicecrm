/**
 * a generic interface for messages related to specific fields when creating
 * dictionary manager records
 */
export interface DictionaryManagerMessage {
    field: string;
    message: string;
}

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
    lhs_sysdictionarydefinition_id: string;
    lhs_sysdictionaryitem_id: string;
    lhs_linkname: string;
    lhs_linklabel: string;
    rhs_sysdictionarydefinition_id: string;
    rhs_sysdictionaryitem_id: string;
    rhs_linkname: string;
    rhs_linklabel: string;
    rhs_relatename: string;
    rhs_relatelabel: string;
    relationship_type: 'one-to-many'|'many-to-many'|'parent';
    join_sysdictionarydefinition_id?: string;
    join_lhs_sysdictionaryitem_id?: string;
    join_rhs_sysdictionaryitem_id?: string;
    relationship_role_column?: string;
    relationship_role_column_value?: string;
    deleted: number;
    version?: string;
    package?: string;
}

/**
 * the relationship relate fields
 */
export interface RelationshipField {
    id: string;
    scope: 'c'|'g';
    status: 'd'|'a'|'i';
    relationship_id: string;
    relationship_fieldname: string;
    sysdictionaryitem_id: string;
    side: 'left'|'right'|'both';
    deleted: number;
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
