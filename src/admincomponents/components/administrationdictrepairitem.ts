/**
 * @module AdminComponentsModule
 */
import {Component, Injector, OnInit} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";


@Component({
    selector: 'administration-dict-repair-item',
    templateUrl: './src/admincomponents/templates/administrationdictrepairitem.html'
})
export class AdministrationDictRepairItem implements OnInit {

    private loading: boolean = false;
    private sql: string = '';

    constructor(private backend: backend, private toast: toast, private language: language, private modal: modal, private injector: Injector) {
    }

    /**
     * execute db repair and save the response
     */
    public ngOnInit() {
        this.loading = true;
        this.backend.getRequest('dictionary/sql').subscribe(result => {
            this.loading = false;
            this.sql = result.sql;
        });
    }

    public execute() {
            this.modal.openModal('AdministrationDictRepairModal', true, this.injector).subscribe(modal => {
                modal.instance.sql = this.sql;
            });
        }


}
