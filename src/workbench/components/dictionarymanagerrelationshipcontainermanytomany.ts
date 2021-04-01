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
import {
    DictionaryDefinition,
    DictionaryItem,
    Relationship,
    RelationshipRelateField
} from "../interfaces/dictionarymanager.interfaces";

/**
 * renders a modal to add a one to many relationship
 */
@Component({
    selector: 'dictionary-manager-relationship-container-manytomany',
    templateUrl: './src/workbench/templates/dictionarymanagerrelationshipcontainermanytomany.html',
})
export class DictionaryManagerRelationshipContainerManyToMany implements OnInit {

    /**
     * the items for the left hand side
     * @private
     */
    private lhs_items: DictionaryItem[] = [];

    /**
     * the items for the right hand side
     * @private
     */
    private rhs_items: DictionaryItem[] = [];

    /**
     * the items for the right hand side
     * @private
     */
    private join_items: DictionaryItem[] = [];

    /**
     * the reltionship itself
     *
     * @private
     */
    @Input() private relationship: Relationship;

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language, private modal: modal, private injector: Injector, private modelutilities: modelutilities) {

    }

    /**
     * getter for the jojn definition id
     */
    get join_sysdictionarydefinition_id(): string{
        return this.relationship.join_sysdictionarydefinition_id;
    }

    /**
     * setter for the join definition id also loading the join dict items and resetting the items left and right on change
     *
     * @param definitionid
     */
    set join_sysdictionarydefinition_id(definitionid: string){
        if(definitionid != this.relationship.join_sysdictionarydefinition_id) {
            this.relationship.join_sysdictionarydefinition_id = definitionid;
            this.relationship.join_rhs_sysdictionaryitem_id = null;
            this.relationship.join_lhs_sysdictionaryitem_id = null;

            // determine the fields of the join table
            this.loadJoinItems();
        }
    }

    /**
     * initialize and build the names
     */
    public ngOnInit() {
        // load the items
        this.loadItems();

        // load the join items
        this.loadJoinItems();
    }

    /**
     * loads the items for the join table
     *
     * @private
     */
    private loadJoinItems(){
        if(this.relationship.join_sysdictionarydefinition_id){
            // determine the fields of the join table
            this.join_items = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.join_sysdictionarydefinition_id);
        } else {
            this.join_items = [];
        }
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

}
