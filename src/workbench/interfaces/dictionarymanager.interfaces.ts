import {DomainField} from "./domainmanager.interfaces";

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
    sysdictionary_type: DictionaryType;
    sysdictionary_contenttype?: string;
    description?: string;
    version?: string;
    package?: string;
}

export interface DictionaryDatabaseField{
    name: string,
    len: string,
    type: string,
    comment: string
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
    sysdictionaryrelationship_id?: string;
    sysdomaindefinition_id?: string;
    label?: string;
    labelinputhelper?: string;
    non_db?: number;
    exclude_from_audited?: number;
    required?: number;
    default_value?: string;
    description?: string;
    version?: string;
    package?: string;
    addFields?: DomainField[];
    defined?:boolean;
    cached?:boolean;
    database?:boolean;
    selected?: boolean;
}

/**
 * the relationship types
 */
export interface RelationshipType{
    id: string;
    name: string;
    label: string;
    class: string;
    component_add: string;
    component_edit: string;
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
    lhs_duplicatemerge: number;
    rhs_sysdictionarydefinition_id: string;
    rhs_sysdictionaryitem_id: string;
    rhs_linkname: string;
    rhs_linklabel: string;
    rhs_relatename: string;
    rhs_relatelabel: string;
    relationship_type: string;
    join_sysdictionarydefinition_id?: string;
    join_lhs_sysdictionaryitem_id?: string;
    join_rhs_sysdictionaryitem_id?: string;
    relationship_role_column?: string;
    relationship_role_column_value?: string;
    rhs_duplicatemerge: number;
    deleted: number;
    version?: string;
    package?: string;
}

export interface RelationshipPolymorph {
    id: string;
    relationship_id: string;
    relationship_name?: string;
    scope: 'c'|'g';
    status?: 'd'|'a'|'i';
    lhs_sysdictionarydefinition_id: string;
    lhs_sysdictionaryitem_id: string;
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
    sysdictionaryrelationship_id: string;
    map_to_fieldname: string;
    sysdictionaryitem_id: string;
    sysdictionarydefinition_id?: string;
    description?: string;
    version?: string;
    package?: string;
    deleted: number;
    /** non-db field for frontend */
    isNew: boolean;
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
    indextype: 'primary'|'index'|'unique'|'foreign';
    description?: string;
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
    sysdictionaryforeigndefinition_id?: string;
    sysdictionaryforeignitem_id?: string;
    sequence: number;
    version?: string;
    package?: string;
}

/**
 * dictionary definition type
 */
export type DictionaryType = 'module' | 'metadata' | 'template' | 'relationship' | 'system';