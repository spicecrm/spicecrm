/**
 * @module AdminComponentsModule
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {toast} from "../../services/toast.service";

@Component({
    selector: 'administration-languages',
    templateUrl: '../templates/administrationlanguages.html',
})

export class AdministrationLanguages implements OnInit {
    /**
     * array to catch the languages
     */
    public languages: any = [];

    public loading: boolean = true;

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public modal: modal,
        public toast: toast,
    ) {

    }

    /**
     * loads the languages
     */
    ngOnInit() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.getRequest('packages').subscribe(data => {
                if (data.versions) {
                    this.languages = data.languages;
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                }
                this.loading = false;
                modalRef.instance.self.destroy();
            });
        });
    }


}
