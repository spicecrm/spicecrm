import {Component} from '@angular/core';
import {DictionaryManagerRelationshipAddManyToMany} from "./dictionarymanagerrelationshipaddmanytomany";

@Component({
    selector: 'dictionary-manager-relationship-add-many-to-many-self',
    templateUrl: '../templates/dictionarymanagerrelationshipaddmanytomanyself.html',
    standalone: false
})
export class DictionaryManagerRelationshipAddManyToManySelf extends DictionaryManagerRelationshipAddManyToMany {

    /**
     * if hte current dictionary is a module, set both side dictionary id from the current dictionary
     */
    public ngOnInit() {

        if (this.currentIsModule) {
            this.lhsRelatedId = this.dictionarymanager.currentDictionaryDefinition;
            this.rhsRelatedId = this.lhsRelatedId;
            this.relationship.lhs_sysdictionarydefinition_id = this.lhsRelatedId;
            this.relationship.rhs_sysdictionarydefinition_id = this.lhsRelatedId;
        }

        super.ngOnInit();
    }
}