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
    selector: 'dictionary-manager-relationship-add-emailaddress',
    templateUrl: '../templates/dictionarymanagerrelationshipaddemailaddress.html',
})
export class DictionaryManagerRelationshipAddEmailAddress {

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
        this.setDefaults();
    }

    get relatedIds(): DictionaryDefinition[] {
        return this.dictionarymanager.dictionarydefinitions.filter(d => d.sysdictionary_type == 'module').sort((a, b) => a.name.localeCompare(b.name));
    }


    /**
     * set various default values
     * @private
     */
    public setDefaults() {
        this.relationship.relationship_type = this.type.name;

        // build default name and relationship name
        let cDefinition = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.dictionarymanager.currentDictionaryDefinition);
        this.relationship.lhs_sysdictionarydefinition_id = cDefinition.id
        this.relationship.name = 'email_addresses';
        this.relationship.relationship_name = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.relationship.lhs_sysdictionarydefinition_id).tablename.toLowerCase() + '_email_addresses';

        // set the defaults
        let iditem = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.lhs_sysdictionarydefinition_id).find(i => i.name == 'id');
        if (iditem) this.relationship.lhs_sysdictionaryitem_id = iditem.id;
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
        })

    }
}
