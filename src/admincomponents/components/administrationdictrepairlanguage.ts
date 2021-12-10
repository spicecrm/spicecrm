/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";
import {Subject} from "rxjs";


@Component({
    selector: 'administration-dict-repair-language',
    templateUrl: '../templates/administrationdictrepairlanguage.html'
})
export class AdministrationDictRepairLanguage {

    public loaderHandler: Subject<string> = new Subject<string>();
    constructor(public backend: backend, public toast: toast, public language: language, public modal: modal) {
    }

    /**
     * calls the repair method in backend, then loads the language from the language service
     */
    public executeLG() {
        let loadingModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getRequest('admin/repair/language').subscribe(result => {
            loadingModal.emit(true);
            if(result.response) {
                this.language.getLanguage(this.loaderHandler);
                this.toast.sendToast(this.language.getLabel('LBL_LANGUAGES_REPAIRED'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }

        });
    }

}
