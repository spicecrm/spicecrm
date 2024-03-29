import {Component, Input, SimpleChanges} from '@angular/core';
import {DictionaryItem, Relationship} from "../interfaces/dictionarymanager.interfaces";
import {dictionarymanager} from "../services/dictionarymanager.service";

@Component({
    selector: 'dictionary-manager-relationship-container-user',
    templateUrl: '../templates/dictionarymanagerrelationshipcontaineruser.html'
})

export class DictionaryManagerRelationshipContainerUser {
    /**
     * read only input flag
     */
    @Input() public readonly: boolean = false;
    /**
     * definition items for the right side
     */
    public rhsItems: DictionaryItem[] = [];
    /**
     * relationship object
     */
    @Input() public relationship: Relationship;

    constructor(public dictionarymanager: dictionarymanager) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.relationship) {
            this.rhsItems = this.dictionarymanager.getDictionaryDefinitionItems(this.relationship.rhs_sysdictionarydefinition_id);
        }
    }

    get relationshipName(): string {
        return this.relationship.relationship_name.replace(/\{tablename}_|_user/g, '');
    }

    set relationshipName(val: string) {
        this.relationship.relationship_name = `{tablename}_${val}_user`;
        this.generateRelationshipFields(val);
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
}