/**
 * @module WorkbenchModule
 */
import {
    Component, Input
} from '@angular/core';

import {dictionarymanager} from '../services/dictionarymanager.service';
import {Relationship, RelationshipPolymorph} from "../interfaces/dictionarymanager.interfaces";
import {backend} from "../../services/backend.service";

@Component({
    selector: 'dictionary-manager-relationships-details',
    templateUrl: '../templates/dictionarymanagerrelationshipsdetails.html',
})
export class DictionaryManagerRelationshipsDetails {

    /**
     * reference to the modal itself
     */
    public self: any;

    @Input() public dictionaryRelationship: Relationship;

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
    }

    get readonly(){
        return this.dictionaryRelationship.status == 'a' || (this.dictionaryRelationship.rhs_sysdictionarydefinition_id != this.dictionarymanager.currentDictionaryDefinition && this.dictionaryRelationship.lhs_sysdictionarydefinition_id != this.dictionarymanager.currentDictionaryDefinition);
    }

    /**
     * close the modal
     */
    public close(){
        // set back the values from teh backup
        this.dictionaryRelationship = JSON.parse(this.backup);
        this.self.destroy();
    }

    /**
     * save the relationship
     *
     * @private
     */
    public save() {
        this.backend.postRequest(`dictionary/relationship/${this.dictionaryRelationship.id}`, {}, {relationship: this.dictionaryRelationship}).subscribe({
            next: (res) => {
                const idx = this.dictionarymanager.dictionaryrelationships.findIndex(r => r.id == this.dictionaryRelationship.id);
                this.dictionarymanager.dictionaryrelationships[idx] = {...this.dictionaryRelationship};
                this.close();
            }
        })

    }
}
