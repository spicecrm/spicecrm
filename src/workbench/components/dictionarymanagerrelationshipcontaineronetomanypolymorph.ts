/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, OnInit, Input
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';

import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryDefinition, Relationship, RelationshipPolymorph} from "../interfaces/dictionarymanager.interfaces";

/**
 * renders a modal to add a one to many relationship
 */
@Component({
    selector: 'dictionary-manager-relationship-container-onetomanypolymorph',
    templateUrl: '../templates/dictionarymanagerrelationshipcontaineronetomanypolymorph.html',
})
export class DictionaryManagerRelationshipContainerOneToManyPolymorph implements OnInit {

    /**
     * the items for the left hand side
     * @private
     */
    public rhs_items: any[] = [];

    /**
     * the reltionship itself
     *
     * @private
     */
    @Input() public relationship: Relationship;

    /**
     * the polymorph records
     */
    @Input() public relationshipPolymorphs: RelationshipPolymorph[] = [];

    /**
     * to set to readonly
     */
    @Input() public readonly: boolean = false;



    constructor(public dictionarymanager: dictionarymanager, public backend: backend, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {
    }

    /**
     * initialize and build the names
     */
    public ngOnInit() {
        // load the items
        this.loadItems();

    }

    get relatedIds(): DictionaryDefinition[] {
        return [];
        return this.dictionarymanager.dictionarydefinitions.filter(d => d.sysdictionary_type == 'module').sort((a, b) => a.name.localeCompare(b.name));
    }

    public addRelated(){
        this.modal.openModal('DictionaryManagerRelationshipContainerOneToManyPolymorphAddRelated', true, this.injector).subscribe({
            next: (modalRef) => {
                modalRef.instance.relationship_id = this.relationship.id;
                modalRef.instance.relationshipscope = this.relationship.scope;
                modalRef.instance.newrelated.subscribe({
                    next: (relationshipPolymorph) => {

                        // determine a default relationship name
                        let rhsDefinitionDetails = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.relationship.rhs_sysdictionarydefinition_id);
                        let lhsDefinitionDetails = this.dictionarymanager.dictionarydefinitions.find(d => d.id == relationshipPolymorph.lhs_sysdictionarydefinition_id);
                        relationshipPolymorph.relationship_name = lhsDefinitionDetails.tablename + '_' + rhsDefinitionDetails.tablename;

                        this.relationshipPolymorphs.push(relationshipPolymorph);
                    }
                })
            }
        })
    }

    /**
     * loads items for left and right definitions
     * @private
     */
    public loadItems() {
        // build the left hand and right hand items
        this.rhs_items = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.rhs_sysdictionarydefinition_id);
    }
}
