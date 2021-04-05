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
 * @module WorkbenchModule
 */
import {
    Component, Injector, OnInit
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {dictionarymanager} from '../services/dictionarymanager.service';
import {Relationship} from "../interfaces/dictionarymanager.interfaces";

/**
 * renders a modal to add a one to many relationship
 */
@Component({
    templateUrl: './src/workbench/templates/dictionarymanagerrelationshipaddmanytomany.html',
})
export class DictionaryManagerRelationshipAddManyToMany implements OnInit {

    /**
     * reference to the modal window
     *
     * @private
     */
    private self: any;

    /**
     * the relationship
     *
     * @private
     */
    private relationship: Relationship;

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language, private modal: modal, private injector: Injector, private modelutilities: modelutilities) {
        this.relationship = {
            id: this.modelutilities.generateGuid(),
            name: '',
            scope: 'c',
            relationship_name: '',
            lhs_sysdictionarydefinition_id: '',
            lhs_sysdictionaryitem_id: '',
            lhs_linkname: '',
            lhs_linklabel: '',
            rhs_sysdictionarydefinition_id: '',
            rhs_sysdictionaryitem_id: '',
            rhs_linkname: '',
            rhs_linklabel: '',
            rhs_relatename: '',
            rhs_relatelabel: '',
            relationship_type: 'many-to-many',
            deleted: 0,
            status: 'd'
        };
    }

    /**
     * initialize and build the names
     */
    public ngOnInit() {

        // set defaults
        this.setDefaults();
    }

    /**
     * set various default values
     * @private
     */
    private setDefaults() {
        // build default name and relationship name
        this.relationship.relationship_name = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.relationship.lhs_sysdictionarydefinition_id).tablename.toLowerCase() + '_' + this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.relationship.rhs_sysdictionarydefinition_id).tablename.toLowerCase();
        this.relationship.name = this.relationship.relationship_name;

        // set the lhs defaults
        let liditem = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.lhs_sysdictionarydefinition_id).find(i => i.name == 'id');
        if (liditem) this.relationship.lhs_sysdictionaryitem_id = liditem.id;
        this.relationship.lhs_linkname = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.relationship.rhs_sysdictionarydefinition_id).tablename.toLowerCase();

        // set the rhs defaults
        let riditem = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.rhs_sysdictionarydefinition_id).find(i => i.name == 'id');
        if (riditem) this.relationship.rhs_sysdictionaryitem_id = riditem.id;
        this.relationship.rhs_linkname = this.dictionarymanager.getDictionaryDefinitionName(this.relationship.lhs_sysdictionarydefinition_id).toLowerCase();
    }

    /**
     * closes the modal
     *
     * @private
     */
    private close() {
        this.self.destroy();
    }

    /**
     * adds the relationship
     *
     * @private
     */
    private add() {
        this.dictionarymanager.dictionaryrelationships.push({...this.relationship});
        this.close();
    }
}
