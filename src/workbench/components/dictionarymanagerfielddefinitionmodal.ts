import {Component, ComponentRef, inject, OnInit} from '@angular/core';
import {ModalComponentI} from "../../objectcomponents/interfaces/objectcomponents.interfaces";
import {DictionaryItem} from "../interfaces/dictionarymanager.interfaces";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {dictionarymanager} from "../services/dictionarymanager.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'dictionary-manager-field-definition-modal',
    templateUrl: '../templates/dictionarymanagerfielddefinitionmodal.html',
    standalone: false
})
export class DictionaryManagerFieldDefinitionModal implements ModalComponentI, OnInit {
    /**
     * reference to this component
     */
    public self: ComponentRef<this>;
    /**
     * backend service reference
     */
    private backend: backend = inject(backend);
    /**
     * toast service reference
     */
    private toast: toast = inject(toast);
    /**
     * dictionary manager service reference
     */
    private dictionaryManager: dictionarymanager = inject(dictionarymanager);
    /**
     * modal service reference
     * @private
     */
    private modal: modal = inject(modal);

    /**
     * passed definition
     */
    public definition: {
        name: string,
        type: string,
        required: 1 | 0,
        len: number,
        vname: string,
        duplicate_merge: 1 | 0,
        default: any,
        dbtype: string
        sysdomainfieldvalidation_id: string,
        sysdomaindefinition_id: string,
        sysdictionaryitem_id: string,
        sysdictionarydomainfield_id: string
    };
    /**
     * the dictionary item
     */
    public dictionaryItem: DictionaryItem;

    public ngOnInit() {

        if (this.definition) return;

        const loading = this.modal.await('LBL_LOADING');

        this.backend.getRequest(`dictionary/${this.dictionaryManager.currentDictionaryDefinition}/item/${this.dictionaryItem.id}/build`).subscribe({
            next: (res) => {
                loading.next(true);
                loading.complete();
                this.definition = res;
            },
            error: () => {
                loading.next(true);
                loading.complete();
                this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        });
    }
    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }
}