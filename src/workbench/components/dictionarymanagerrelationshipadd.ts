/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, OnInit
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
export class DictionaryManagerRelationshipAdd implements OnInit{

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
    public selectedType: string;

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

    }

    public ngOnInit() {
        this.related_ids = this.dictionarymanager.dictionarydefinitions.filter(d => d.sysdictionary_type == 'module').sort((a, b) => a.name.localeCompare(b.name));
        this.scope = this.dictionarymanager.currentDictionaryScope;
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
        let relType = this.dictionarymanager.dictionaryrelationshiptypes.find(rt => rt.id == this.selectedType);
        this.modal.openModal(relType.component_add, true, this.injector).subscribe(modalRef => {
            modalRef.instance.relationship.scope = this.scope;
            modalRef.instance.type = relType;
        });
        this.close();
    }

}
