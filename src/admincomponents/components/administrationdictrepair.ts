/**
 * @module AdminComponentsModule
 */
import {Component, Injector} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {language} from "../../services/language.service";
import {result} from "underscore";


@Component({
    selector: 'administration-dict-repair',
    templateUrl: '../templates/administrationdictrepair.html'
})
export class AdministrationDictRepair {


    constructor(public backend: backend, public toast: toast, public modal: modal, public injector: Injector) {
    }

    /**
     * initiates a pull from the repo and updates the code
     *
     */
    public pullFromRepository(){
        this.modal.openModal('AdministrationDictRepairGitPullModal', true, this.injector);
    }

}
