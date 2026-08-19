/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {modal} from '../../services/modal.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {configurationService} from "../../services/configuration.service";

/**
 * the central dictionary Manager
 */
@Component({
    selector: 'dictionary-manager',
    templateUrl: '../templates/dictionarymanager.html',
    providers: [dictionarymanager],
    standalone: false
})
export class DictionaryManager {

    public definitionsExpanded: boolean = false;

    constructor(public dictionarymanager: dictionarymanager,
                public modal: modal,
                public backend: backend,
                public toast: toast,
                public injector: Injector,
                private configurationService: configurationService) {
    }

    public migrate(){
        this.modal.openModal('DictionaryManagerMigrateDefinitionModal', true, this.injector);
    }

    /**
     * calls the backend repair method that delivers the sql string, injects it in the modal
     */
    public repairDBnew() {
        this.modal.openModal('DictionaryManagerRepairAll', true, this.injector);
    }

    /**
     * open the convert modal
     */
    public convertCharset() {
        this.modal.openModal('AdministrationDictRepairConvertDBCharsetModal', true, this.injector);
    }

    public repairDBColumns() {
        this.modal.openModal('AdministrationDictRepairDbColumnsModal', true, this.injector);
    }



}
