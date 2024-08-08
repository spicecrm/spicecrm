import {Component, ComponentRef} from '@angular/core';
import {backend} from "../../services/backend.service";
import {dictionarymanager} from "../services/dictionarymanager.service";
import {DictionaryItem, Relationship, RelationshipType} from "../interfaces/dictionarymanager.interfaces";

@Component({
    selector: 'dictionary-manager-relationship-add-user',
    templateUrl: '../templates/dictionarymanagerrelationshipadduser.html'
})

export class DictionaryManagerRelationshipAddUser {
    /**
     * relationship type passed from the parent
     */
    public type: RelationshipType;
    /**
     * definition items for the right side
     */
    public rhsItems: DictionaryItem[] = [];
    /**
     * relationship object
     */
    public relationship: Relationship = {
        id: this.dictionarymanager.modelutilities.generateGuid(),
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
    /**
     * reference to this component to enable destroy
     */
    public self: ComponentRef<DictionaryManagerRelationshipAddUser>;

    constructor(private backend: backend, public dictionarymanager: dictionarymanager) {
        this.setDefaultFields();
    }

    set relationshipName(val: string) {
        this.relationship.relationship_name = val;
        this.generateRelationshipFields(val);
    }

    get relationshipName(): string {
        return this.relationship.relationship_name;
    }

    /**
     * generate relationship fields from name
     * @param name
     */
    public generateRelationshipFields(name: string) {
        this.relationship.rhs_linkname = `${name}_user_link`;
        this.relationship.rhs_relatename = `${name}_user_name`;
        this.relationship.rhs_sysdictionaryitem_id = this.rhsItems.find(i => i.name == name + '_user_id')?.id;
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
        
        this.relationship.relationship_name = `{tablename}_${this.relationship.relationship_name}_user`;

        this.backend.postRequest(`dictionary/relationship/${this.relationship.id}`, {}, {relationship: this.relationship}).subscribe({
            next: (res) => {
                this.dictionarymanager.pushNewRelationshipToArray(this.relationship);
                this.close();
            }
        });

    }

    /**
     * set the left side user dictionary fields
     * @private
     */
    private setDefaultFields() {
        this.relationship.lhs_sysdictionarydefinition_id = this.dictionarymanager.dictionarydefinitions.find(d => d.name == 'User').id;
        this.relationship.lhs_sysdictionaryitem_id = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.lhs_sysdictionarydefinition_id).find(i => i.name == 'id').id;
        this.relationship.rhs_sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;

        this.rhsItems = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.rhs_sysdictionarydefinition_id);

        this.relationship.relationship_type = 'user';

    }
}