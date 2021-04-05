/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
