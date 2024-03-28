/**
 * @module WorkbenchModule
 */
import {Component, Injector, OnInit, Input, OnChanges} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

import {dictionarymanager} from '../services/dictionarymanager.service';
import {
    DictionaryDefinition,
    DictionaryItem,
    Relationship, RelationshipField,
} from "../interfaces/dictionarymanager.interfaces";

/**
 * renders a modal to add a one to many relationship
 */
@Component({
    selector: 'dictionary-manager-relationship-container-manytomany',
    templateUrl: '../templates/dictionarymanagerrelationshipcontainermanytomany.html',
})
export class DictionaryManagerRelationshipContainerManyToMany implements OnInit, OnChanges {

    /**
     * the items for the left hand side
     * @private
     */
    public lhs_items: DictionaryItem[] = [];

    /**
     * the items for the right hand side
     * @private
     */
    public rhs_items: DictionaryItem[] = [];

    /**
     * the items for the right hand side
     * @private
     */
    public join_items: DictionaryItem[] = [];

    /**
     * the reltionship itself
     *
     * @private
     */
    @Input() public relationship: Relationship;

    @Input() public relationshipFields: RelationshipField[] = [];
    /**
     * relationship fields per dictionary item for the view
     */
    public relationshipFieldsPerItem: {id: string, leftField: RelationshipField, rightField: RelationshipField; }[] = [];

    /**
     * to set to readonly
     */
    @Input() public readonly: boolean = false;

    public relationsTables: DictionaryDefinition[] = [];

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {
        this.getRelationshipTables();
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

    public ngOnChanges() {
        this.buildRelationshipFieldsPerItem();
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

    public getRelationshipTables(){
        this.relationsTables = this.dictionarymanager.dictionarydefinitions.filter(d => d.sysdictionary_type == 'relationship' || d.sysdictionary_type == 'metadata').sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * set build the relationship fields array per item
     */
    private buildRelationshipFieldsPerItem() {

        if (!this.relationship || this.relationshipFields.length == 0) return;

        const items = {};

        this.relationshipFields.forEach(field => {

            if (field.deleted == 1) return;

            if (!items[field.sysdictionaryitem_id]) items[field.sysdictionaryitem_id] = {
                id: field.sysdictionaryitem_id
            };

            if (field.sysdictionarydefinition_id == this.relationship.lhs_sysdictionarydefinition_id) {
                items[field.sysdictionaryitem_id].leftField = field;
            } else {
                items[field.sysdictionaryitem_id].rightField = field;
            }
        });

        this.relationshipFieldsPerItem = Object.values(items);

        // regenerate the missing sides
        this.relationshipFieldsPerItem.forEach(item => {

            if (!item.leftField) {
                item.leftField = this.generateRelationshipField(item.id, this.relationship.lhs_sysdictionarydefinition_id);
                this.relationshipFields.push(item.leftField);
            }

            if (!item.rightField) {
                item.rightField = this.generateRelationshipField(item.id, this.relationship.rhs_sysdictionarydefinition_id);
                this.relationshipFields.push(item.rightField);
            }
        });
    }

    /**
     * loads the items for the join table
     *
     * @private
     */
    public loadJoinItems(){
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
    public loadItems() {
        // build the left hand and right hand items
        this.lhs_items = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.lhs_sysdictionarydefinition_id);
        this.rhs_items = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.rhs_sysdictionarydefinition_id);
    }

    /**
     * add new join table role filed mapping
     */
    public addNewJoinTableFieldMapping() {

        const options = this.join_items.filter(
            i => !['id', 'deleted'].some(forbidden => forbidden == i.name) && this.relationship.join_lhs_sysdictionaryitem_id != i.id && this.relationship.join_rhs_sysdictionaryitem_id != i.id && !this.relationshipFieldsPerItem.some(relItem => relItem.id == i.id)
        ).map(e => ({value: e.id, display: e.name}));

        this.modal.prompt('input', 'LBL_MAKE_SELECTION', 'LBL_DICTIONARY_ITEM', 'default', undefined, options).subscribe(joinItemId => {

                if (!joinItemId) return;

                const leftField = this.generateRelationshipField(joinItemId, this.relationship.lhs_sysdictionarydefinition_id);
                const rightField = this.generateRelationshipField(joinItemId, this.relationship.rhs_sysdictionarydefinition_id);

                this.relationshipFields.push(leftField, rightField);

                this.relationshipFieldsPerItem.push({
                    id: joinItemId,
                    leftField,
                    rightField
                });
            });
    }

    /**
     * delete join table field
     * @param id
     */
    public deleteJoinTableFieldMapping(id: string) {

        this.relationshipFields.forEach((field, index) => {
            if (field.sysdictionaryitem_id != id) return false;

            if (field.isNew) {
                this.relationshipFields.splice(index, 1);
            } else {
                field.deleted = 1;
            }
        });

        this.relationshipFieldsPerItem = this.relationshipFieldsPerItem.filter(i => i.id != id);
    }

    /**
     * generate relationship field
     * @param joinItemId
     * @param definitionId
     * @private
     */
    private generateRelationshipField(joinItemId: string, definitionId: string): RelationshipField {
        return {
            sysdictionarydefinition_id: definitionId,
            id: this.modelutilities.generateGuid(),
            scope: this.relationship.scope,
            status: 'd',
            sysdictionaryrelationship_id: this.relationship.id,
            map_to_fieldname: '',
            sysdictionaryitem_id: joinItemId,
            deleted: 0,
            isNew: true
        };
    }
}
