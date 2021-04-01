/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleSAPIDOCs
 */

export interface sapIDOCSegmentI {
    id: string;
    deleted: '0' | '1';
    active: '0' | '1';
    sap_segment: string;
    sysmodule_id?: string;
    split_field?: string;
    split_length?: string;
    description?: string;
}

export interface sapIDOCSegmentRelationI {
    id: string;
    deleted: '0' | '1';
    required_export: '0' | '1';
    parent_segment_id: string;
    segment_id: string;
    relationship_name?: string;
    idoctyp?: string;
    mestyp?: string;
    segment_order?: string;
    segment_function?: string;
}

export interface sapIDOCTypeI {
    idoctyp: string;
    mestyp: string;
    segments: sapIDOCSegmentRelationI[];
}

export interface sapIDOCFieldI {
    id: string;
    deleted: '0' | '1';
    active: '0' | '1';
    mapping_field?: string;
    sap_field?: string;
    identifier: '0' | '1';
    inbound: '0' | '1';
    outbound: '0' | '1';
    required: '0' | '1';
    segment_id: string;
    custom_field_function?: string;
    mapping_rule?: 'regular' | 'array' | 'exclusive' | 'merge';
    mapping_order?: string;
    mapping_field_default?: string;
    mapping_field_prefix?: string;
    value_conector?: string;
}
