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
