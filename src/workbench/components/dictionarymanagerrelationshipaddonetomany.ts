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
import {DictionaryDefinition, Relationship, RelationshipType} from "../interfaces/dictionarymanager.interfaces";
import {backend} from "../../services/backend.service";

/**
 * renders a modal to add a one to many relationship
 */
@Component({
    templateUrl: '../templates/dictionarymanagerrelationshipaddonetomany.html',
})
export class DictionaryManagerRelationshipAddOneToMany {

    /**
     * reference to the modal window
     *
     * @private
     */
    public self: any;

    public type: RelationshipType = null;

    /**
     * the relationship
     *
     * @private
     */
    public relationship: Relationship;

    public relatedId: string;

    constructor(public dictionarymanager: dictionarymanager, public backend: backend, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {
        this.relationship = {
            id: this.modelutilities.generateGuid(),
            name: '',
            scope: 'c',
            relationship_name: '',
            lhs_sysdictionarydefinition_id: '',
            lhs_sysdictionaryitem_id: '',
            lhs_linkname: '',
            lhs_linklabel: '',
            lhs_duplicatemerge: 1,
            rhs_sysdictionarydefinition_id: '',
            rhs_sysdictionaryitem_id: '',
            rhs_linkname: '',
            rhs_linklabel: '',
            rhs_duplicatemerge: 0,
            rhs_relatename: '',
            rhs_relatelabel: '',
            relationship_type: '',
            deleted: 0,
            status: 'd'
        };
    }

    /**
     * initialize and build the names
     */
    public ngOnInit() {


    }

    get relatedIds(): DictionaryDefinition[] {
        return this.dictionarymanager.dictionarydefinitions.filter(d => d.sysdictionary_type == 'module').sort((a, b) => a.name.localeCompare(b.name));
    }


    public setRelated(){
        this.setDefaults();
    }

    get hasRelated(){
        switch (this.type.name) {
            case 'one-to-many':
                return !!this.relationship.rhs_sysdictionarydefinition_id;
            case 'many-to-one':
                return !! this.relationship.lhs_sysdictionarydefinition_id;
        }
    }

    /**
     * set various default values
     * @private
     */
    public setDefaults() {
        this.relationship.relationship_type = this.type.name;

        switch (this.type.name) {
            case 'one-to-many':
                this.relationship.rhs_sysdictionarydefinition_id = this.relatedId;
                this.relationship.lhs_sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;
                break;
            case 'many-to-one':
                this.relationship.lhs_sysdictionarydefinition_id = this.relatedId;
                this.relationship.rhs_sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;
                break;
        }

        // build default name and relationship name
        this.relationship.name = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.relationship.lhs_sysdictionarydefinition_id).tablename.toLowerCase();
        this.relationship.relationship_name = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.relationship.lhs_sysdictionarydefinition_id).tablename.toLowerCase() + '_' + this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.relationship.rhs_sysdictionarydefinition_id).tablename.toLowerCase();

        // set the defaults
        let iditem = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.lhs_sysdictionarydefinition_id).find(i => i.name == 'id');
        if (iditem) this.relationship.lhs_sysdictionaryitem_id = iditem.id;

        // determine the default link field and link name
        this.relationship.rhs_linkname = this.dictionarymanager.getDictionaryDefinitionName(this.relationship.lhs_sysdictionarydefinition_id).toLowerCase();
        this.relationship.rhs_relatename = this.dictionarymanager.getDictionaryDefinitionName(this.relationship.lhs_sysdictionarydefinition_id).toLowerCase() + '_name';

        // determine the default lhs link name
        this.relationship.lhs_linkname = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.relationship.rhs_sysdictionarydefinition_id).tablename.toLowerCase();
    }

    /**
     * closes the modal
     *
     * @private
     */
    public close() {
        this.self.destroy();
    }

    /**
     * adds the relationship
     *
     * @private
     */
    public add(){
        this.backend.postRequest(`dictionary/relationship/${this.relationship.id}`, {}, {relationship: this.relationship}).subscribe({
            next: (res) => {
                this.dictionarymanager.pushNewRelationshipToArray(this.relationship);
                this.close();
            }
        });

    }
}
