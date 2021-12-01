/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


import {dictionarymanager} from '../services/dictionarymanager.service';

/**
 * renders a modal to select the type of the relationship
 */
@Component({
    templateUrl: '../templates/dictionarymanagerrelationshipadd.html',
})
export class DictionaryManagerRelationshipAdd {

    /**
     * reference to the modal window
     *
     * @private
     */
    public self: any;

    /**
     * the type of the relationship
     * @private
     */
    public relationshipType: 'one-to-many' | 'many-to-one' | 'many-to-many' | 'parent' = 'one-to-many';

    /**
     * the id of the related dictionaryitem
     *
     * @private
     */
    public related_id: string;

    /**
     * the selectable related ids based on the type module
     * @private
     */
    public related_ids: any[] = [];

    /**
     * the scope
     *
     * @private
     */
    public scope: 'c' | 'g';

    constructor(public dictionarymanager: dictionarymanager, public modal: modal, public injector: Injector) {
        this.related_ids = this.dictionarymanager.dictionarydefinitions.filter(d => d.sysdictionary_type == 'module' && d.deleted == 0).sort((a, b) => a.name.localeCompare(b.name));
        this.scope = this.dictionarymanager.defaultScope;
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
     * continues adding the relationship
     *
     * @private
     */
    public add() {
        switch (this.relationshipType) {
            case 'one-to-many':
                this.modal.openModal('DictionaryManagerRelationshipAddOneToMany', true, this.injector).subscribe(modalRef => {
                    modalRef.instance.relationship.rhs_sysdictionarydefinition_id = this.related_id;
                    modalRef.instance.relationship.scope = this.scope;
                    modalRef.instance.relationship.lhs_sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;
                });
                break;
            case 'many-to-one':
                this.modal.openModal('DictionaryManagerRelationshipAddOneToMany', true, this.injector).subscribe(modalRef => {
                    modalRef.instance.relationship.lhs_sysdictionarydefinition_id = this.related_id;
                    modalRef.instance.relationship.scope = this.scope;
                    modalRef.instance.relationship.rhs_sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;
                });
                break;
            case 'many-to-many':
                this.modal.openModal('DictionaryManagerRelationshipAddManyToMany', true, this.injector).subscribe(modalRef => {
                    modalRef.instance.relationship.rhs_sysdictionarydefinition_id = this.related_id;
                    modalRef.instance.relationship.scope = this.scope;
                    modalRef.instance.relationship.lhs_sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;
                });
                break;
            case 'parent':
                this.modal.openModal('DictionaryManagerRelationshipAddParent', true, this.injector).subscribe(modalRef => {
                    modalRef.instance.relationship.lhs_sysdictionarydefinition_id = this.related_id;
                    modalRef.instance.relationship.scope = this.scope;
                    modalRef.instance.relationship.rhs_sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;
                });
                break;
        }
        this.close();
    }

}
