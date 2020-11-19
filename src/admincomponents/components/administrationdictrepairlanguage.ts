/**
 * @module AdminComponentsModule
 */
import {Component, Injector, OnInit} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {loader} from "../../services/loader.service";
import {modal} from "../../services/modal.service";
import {Subject} from "rxjs";


@Component({
    selector: 'administration-dict-repair-language',
    templateUrl: './src/admincomponents/templates/administrationdictrepairlanguage.html'
})
export class AdministrationDictRepairLanguage {

    private sql: string = '';
    private loaderHandler: Subject<string> = new Subject<string>();
    constructor(private backend: backend, private toast: toast, private language: language, private modal: modal, private injector: Injector, private loader: loader) {
    }


    public executeLG() {
        let await = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getRequest('/repair/language').subscribe(result => {
            if(result.response) {
                this.language.getLanguage(this.loaderHandler);
            }
            await.emit(true);
            this.toast.sendToast('LBL_LANGUAGES_REPAIRED', 'success');
        });
    }

}
