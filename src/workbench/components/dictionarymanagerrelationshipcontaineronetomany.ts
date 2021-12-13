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

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {
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
