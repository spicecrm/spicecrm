/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, Input, OnInit
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';

import {dictionarymanager} from '../services/dictionarymanager.service';
import {
    DictionaryDefinition,
    Relationship,
    RelationshipField,
    RelationshipType
} from "../interfaces/dictionarymanager.interfaces";

/**
 * renders a modal to add a one to many relationship
 */
@Component({
    templateUrl: '../templates/dictionarymanagerrelationshipaddmanytomany.html',
})
export class DictionaryManagerRelationshipAddManyToMany implements OnInit {

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
    /**
     * relationship join table role fields
     */
    @Input() public relationshipFields: RelationshipField[] = [];


    public rhsRelatedId: string;
    public lhsRelatedId: string;

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
            relationship_type: 'many-to-many',
            deleted: 0,
            status: 'd'
        };
    }

    /**
     * initialize and build the names
     */
    public ngOnInit() {
        if(this.currentIsModule){
            this.lhsRelatedId = this.dictionarymanager.currentDictionaryDefinition;
        }

        // if we have a relationship or metadata table use it as joint table
        if(this.dictionarymanager.getCurrentDefinition()?.sysdictionary_type == 'metadata' || this.dictionarymanager.getCurrentDefinition()?.sysdictionary_type == 'relationship'){
            this.relationship.join_sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;
        }
    }

    /**
     * checks if the current is a module
     */
    get currentIsModule(){
        return this.dictionarymanager.getCurrentDefinition().sysdictionary_type == 'module'
    }

    get relatedIds(): DictionaryDefinition[] {
        return this.dictionarymanager.dictionarydefinitions.filter(d => d.sysdictionary_type == 'module').sort((a, b) => a.name.localeCompare(b.name));
    }


    public setRelated(){
        this.setDefaults();
    }

    get hasRelated(){
       return !!this.relationship.lhs_sysdictionarydefinition_id && !!this.relationship.rhs_sysdictionarydefinition_id;
    }

    /**
     * set various default values
     * @private
     */
    public setDefaults() {
        this.relationship.lhs_sysdictionarydefinition_id = this.lhsRelatedId;
        this.relationship.rhs_sysdictionarydefinition_id = this.rhsRelatedId;

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
    public close() {
        this.self.destroy();
    }

    /**
     * adds the relationship
     *
     * @private
     */
    public add() {

        const relationshipFields = this.relationshipFields.filter(f => !!f.map_to_fieldname || !f.isNew)
            .map(field => {

                // mark empty entries as deleted if they are not new
                if (!field.isNew && !field.map_to_fieldname) {
                    field.deleted = 1;
                }

                delete field.isNew;
                return field;
            });

        this.backend.postRequest(`dictionary/relationship/${this.relationship.id}`, {}, {relationship: this.relationship, relationshipFields}).subscribe({
            next: (res) => {
                this.dictionarymanager.pushNewRelationshipToArray(this.relationship);
                this.dictionarymanager.dictionaryrelationshipfields.push(...this.relationshipFields);
                this.close();
            }
        })
    }
}
