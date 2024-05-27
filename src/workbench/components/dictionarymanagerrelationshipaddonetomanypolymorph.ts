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
import {
    DictionaryDefinition,
    Relationship,
    RelationshipPolymorph,
    RelationshipType
} from "../interfaces/dictionarymanager.interfaces";
import {backend} from "../../services/backend.service";

/**
 * renders a modal to add a one to many polymorphic relationship
 */
@Component({
    templateUrl: '../templates/dictionarymanagerrelationshipaddonetomanypolymorph.html',
})
export class DictionaryManagerRelationshipAddOneToManyPolymorph {

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

    public relationshipPolymorphs: RelationshipPolymorph[] = [];

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
        this.relationship.relationship_type = 'one-to-many-polymorph';
        this.relationship.rhs_sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;

        // build default name and relationship name
        this.relationship.name = 'parent'

        // set the defaults for a parent_id and parent_type if we have one
        let parentiditem = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.rhs_sysdictionarydefinition_id).find(i => i.name == 'parent_id');
        if (parentiditem) this.relationship.rhs_sysdictionaryitem_id = parentiditem.id;
        let parenttypeitem = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.rhs_sysdictionarydefinition_id).find(i => i.name == 'parent_type');
        if (parenttypeitem) this.relationship.relationship_role_column = parenttypeitem.id;
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
        this.backend.postRequest(`dictionary/relationship/${this.relationship.id}`, {}, {relationship: this.relationship, relationshippolymorphs: this.relationshipPolymorphs}).subscribe({
            next: (res) => {
                this.dictionarymanager.pushNewRelationshipToArray(this.relationship);
                this.close();
            }
        })
    }
}
