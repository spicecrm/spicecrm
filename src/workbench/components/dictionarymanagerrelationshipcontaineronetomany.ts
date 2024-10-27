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
import {DictionaryDefinition, Relationship, RelationshipRelateField} from "../interfaces/dictionarymanager.interfaces";

/**
 * renders a modal to add a one to many relationship
 */
@Component({
    selector: 'dictionary-manager-relationship-container-onetomany',
    templateUrl: '../templates/dictionarymanagerrelationshipcontaineronetomany.html',
})
export class DictionaryManagerRelationshipContainerOneToMany implements OnInit {

    /**
     * the items for the left hand side
     * @private
     */
    public lhs_items: any[] = [];

    /**
     * the items for the right hand side
     * @private
     */
    public rhs_items: any[] = [];

    /**
     * the relationshiprelatefields
     *
     * @private
     */
    public relationshiprelatefields: RelationshipRelateField[] = [];

    /**
     * the reltionship itself
     *
     * @private
     */
    @Input() public relationship: Relationship;

    /**
     * to set to readonly
     */
    @Input() public readonly: boolean = false;

    public relatedIds: DictionaryDefinition[] = [];

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {
    }

    get rhs_linkdefault(){
        return this.relationship.rhs_linkdefault == 1;
    }

    set rhs_linkdefault(value){
        this.relationship.rhs_linkdefault = value ? 1 : 0;
    }

    get rhs_duplicatemerge(){
        return this.relationship.rhs_duplicatemerge == 1;
    }

    set rhs_duplicatemerge(value){
        this.relationship.rhs_duplicatemerge = value ? 1 : 0;
    }

    get lhs_duplicatemerge(){
        return this.relationship.lhs_duplicatemerge == 1;
    }

    set lhs_duplicatemerge(value){
        this.relationship.lhs_duplicatemerge = value ? 1 : 0;
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
    public loadItems() {
        // build the left hand and right hand items
        this.lhs_items = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.lhs_sysdictionarydefinition_id);
        this.rhs_items = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.rhs_sysdictionarydefinition_id);
    }

    /**
     * loads the relationship fields
     *
     * @private
     */
    public loadRelationshipFields() {
        this.relationshiprelatefields = this.dictionarymanager.dictionaryrelationshiprelatefields.filter(rf => rf.relationship_id == this.relationship.id);
    }

}
