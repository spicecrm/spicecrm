/**
 * @module WorkbenchModule
 */
import {
    Component, Input
} from '@angular/core';

import {dictionarymanager} from '../services/dictionarymanager.service';
import {Relationship, RelationshipField, RelationshipPolymorph} from "../interfaces/dictionarymanager.interfaces";
import {backend} from "../../services/backend.service";
import {view} from "../../services/view.service";

@Component({
    selector: 'dictionary-manager-relationships-details',
    templateUrl: '../templates/dictionarymanagerrelationshipsdetails.html',
    providers: [view],
    standalone: false
})
export class DictionaryManagerRelationshipsDetails {
    /**
     * label mapping for type
     */
    public readonly relationshipTitleLabel = {
        'email-address': 'LBL_EMAIL_ADDRESS',
        'email-one': 'LBL_ONE_TO_MANY',
        'one-to-many': 'LBL_ONE_TO_MANY',
        'many-to-one': 'LBL_ONE_TO_MANY',
        'one-to-many-polymorph': 'LBL_1_TO_N_POLYMORPHIC',
        'many-to-many': 'LBL_MANY_TO_MANY',
        'many-to-many-bean': 'LBL_MANY_TO_MANY',
        'many-to-many-prospectlists': 'LBL_MANY_TO_MANY_PROSPECTLISTS',
        'parent': 'LBL_PARENT',
        'user': 'LBL_USER',
        'orgunit': 'LBL_ORGUNIT',
    };

    /**
     * reference to the modal itself
     */
    public self: any;

    @Input() public dictionaryRelationship: Relationship;

    @Input() public dictionaryRelationshipFields: RelationshipField[];

    /**
     * any polymorphs we might have
     */
    public dictionaryRelationshipPolymorphs: RelationshipPolymorph[] = [];

    /**
     * a JSON reprensetnation of the original item
     * @private
     */
    private backup: string;

    constructor(public dictionarymanager: dictionarymanager, private backend: backend) {

    }

    /**
     * initialize and create a backup
     */
    public ngOnInit() {
        // create a backup
        this.backup = JSON.stringify(this.dictionaryRelationship);

        // try to get the polymorphs
        this.dictionaryRelationshipPolymorphs = this.dictionarymanager.dictionaryrelationshippolymorphs.filter(p => p.relationship_id == this.dictionaryRelationship.id);
        this.dictionaryRelationshipFields = this.dictionarymanager.dictionaryrelationshipfields.filter(f => f.sysdictionaryrelationship_id == this.dictionaryRelationship.id);
    }

    get readonly() {
        return this.dictionaryRelationship.status == 'a' || (
            this.dictionaryRelationship.rhs_sysdictionarydefinition_id != this.dictionarymanager.currentDictionaryDefinition
            && this.dictionaryRelationship.lhs_sysdictionarydefinition_id != this.dictionarymanager.currentDictionaryDefinition
            && this.dictionaryRelationship.join_sysdictionarydefinition_id != this.dictionarymanager.currentDictionaryDefinition
        );
    }

    /**
     * close the modal
     */
    public close() {
        // set back the values from teh backup
        this.dictionaryRelationship = JSON.parse(this.backup);
        this.dictionarymanager.updateRelationshipInArray(this.dictionaryRelationship);

        this.self.destroy();
    }

    /**
     * save the relationship
     *
     * @private
     */
    public save() {

        const relationshipFields = this.dictionaryRelationshipFields.filter(f => !!f.map_to_fieldname || !f.isNew).map(field => {

            // mark empty entries as deleted if they are not new
            if (!field.isNew && !field.map_to_fieldname) {
                field.deleted = 1;
            }

            delete field.isNew;
            return field;
        });


        this.backend.postRequest(`dictionary/relationship/${this.dictionaryRelationship.id}`, {}, {
            relationship: this.dictionaryRelationship,
            relationshipFields: relationshipFields,
            relationshippolymorphs: this.dictionaryRelationshipPolymorphs
        }).subscribe({
            next: () => {
                this.dictionarymanager.updateRelationshipInArray(this.dictionaryRelationship);
                this.dictionarymanager.updateRelationshippFieldsInArray(relationshipFields);
                this.dictionarymanager.updateRelationshipPolymorphsInArray(this.dictionaryRelationship.id, this.dictionaryRelationshipPolymorphs);
                this.self.destroy();
            }
        });

    }
}
