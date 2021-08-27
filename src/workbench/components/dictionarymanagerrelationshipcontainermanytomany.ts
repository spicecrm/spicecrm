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
