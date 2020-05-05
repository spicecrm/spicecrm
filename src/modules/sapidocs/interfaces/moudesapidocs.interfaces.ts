/**
 * @module ModuleSAPIDOCs
 */

export interface sapIDOCSegmentI {
    id: string;
    deleted: '0'|'1';
    active: '0'|'1';
    sap_segment: string;
    sysmodule_id?: string;
    split_field?: string;
    split_length?: string;
    description?: string;
}

export interface sapIDOCSegmentRelationI {
    id: string;
    deleted: '0'|'1';
    required_export: '0'|'1';
    parent_segment_id: string;
    segment_id: string;
    relationship_name?: string;
    idoctyp?: string;
    mestyp?: string;
    segment_order?: string;
    segment_function?: string;
}


export interface sapIDOCFieldI {
    id: string;
    deleted: '0'|'1';
    active: '0'|'1';
    mapping_field?: string;
    sap_field?: string;
    identifier: '0'|'1';
    inbound: '0'|'1';
    outbound: '0'|'1';
    required: '0'|'1';
    segment_id: string;
    custom_field_function?: string;
    mapping_rule?: 'regular'|'array'|'exclusive'|'merge';
    mapping_order?: string;
    mapping_field_default?: string;
    mapping_field_prefix?: string;
    value_conector?: string;
}
