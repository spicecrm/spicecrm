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
 * @module WorkbenchModule
 */
import {
    Component, Injector, OnInit, Input
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {dictionarymanager} from '../services/dictionarymanager.service';
import {Relationship, RelationshipRelateField} from "../interfaces/dictionarymanager.interfaces";

/**
 * renders a modal to add a one to many relationship
 */
@Component({
    selector: 'dictionary-manager-relationship-container-parent',
    templateUrl: './src/workbench/templates/dictionarymanagerrelationshipcontainerparent.html',
})
export class DictionaryManagerRelationshipContainerParent implements OnInit {

    /**
     * the items for the left hand side
     * @private
     */
    private lhs_items: any[] = [];

    /**
     * the items for the right hand side
     * @private
     */
    private rhs_items: any[] = [];

    /**
     * the relationshiprelatefields
     *
     * @private
     */
    private relationshiprelatefields: RelationshipRelateField[] = [];

    /**
     * the reltionship itself
     *
     * @private
     */
    @Input() private relationship: Relationship;

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language, private modal: modal, private injector: Injector, private modelutilities: modelutilities) {
    }

    /**
     * initialize and build the names
     */
    public ngOnInit() {
        // load the items
        this.loadItems();

        // load the relationship relate fields
        this.loadRelationshipFields();
    }

    /**
     * loads items for left and right definitions
     * @private
     */
    private loadItems() {
        // build the left hand and right hand items
        this.lhs_items = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.lhs_sysdictionarydefinition_id);
        this.rhs_items = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.rhs_sysdictionarydefinition_id);
    }

    /**
     * loads the relationship fields
     *
     * @private
     */
    private loadRelationshipFields() {
        this.relationshiprelatefields = this.dictionarymanager.dictionaryrelationshiprelatefields.filter(rf => rf.relationship_id == this.relationship.id);
    }

    /**
     * gett r for the value
     */
    get rhs_sysdictionaryitem_id() {
        return this.relationship.rhs_sysdictionaryitem_id;
    }

    /**
     * setter for the value also automaticvalls set the relate name
     * @param value
     */
    set rhs_sysdictionaryitem_id(value) {
        // set the id
        this.relationship.rhs_sysdictionaryitem_id = value;

        // find the name and buils the paretn_name field automatically
        this.relationship.rhs_relatename =  this.rhs_items.find(i => i.id == value).name + '_name';
    }

}
