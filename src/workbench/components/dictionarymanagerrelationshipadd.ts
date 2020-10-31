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
    templateUrl: './src/workbench/templates/dictionarymanagerrelationshipadd.html',
})
export class DictionaryManagerRelationshipAdd {

    /**
     * reference to the modal window
     *
     * @private
     */
    private self: any;

    /**
     * the type of the relationship
     * @private
     */
    private relationshipType: 'one-to-many'|'many-to-many'|'parent' = 'one-to-many';

    /**
     * the id of the related dictionaryitem
     *
     * @private
     */
    private related_id: string;

    /**
     * the selectable related ids based on the type module
     * @private
     */
    private related_ids: any[] = [];

    /**
     * the scope
     *
     * @private
     */
    private scope: 'c'|'g';

    constructor(private dictionarymanager: dictionarymanager, private modal: modal, private injector: Injector) {
        this.related_ids = this.dictionarymanager.dictionarydefinitions.filter(d => d.sysdictionary_type == 'module' || d.sysdictionary_type == 'template');
        this.scope = this.dictionarymanager.defaultScope;
    }

    /**
     * closes the modal
     *
     * @private
     */
    private close(){
        this.self.destroy();
    }

    /**
     * continues adding the relationship
     *
     * @private
     */
    private add(){
       switch(this.relationshipType){
           case 'one-to-many':
               this.modal.openModal('DictionaryManagerRelationshipAddOneToMany', true, this.injector).subscribe(modalRef => {
                   modalRef.instance.relationship.rhs_sysdictonarydefinition_id = this.related_id;
                   modalRef.instance.relationship.scope = this.scope;
                   modalRef.instance.relationship.lhs_sysdictonarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;
               });
               break;
       }
       this.close();
    }

}
