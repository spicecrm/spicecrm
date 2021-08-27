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
