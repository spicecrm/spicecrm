/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";


/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'administration-dict-repair',
    templateUrl: './src/admincomponents/templates/administrationdictrepair.html'
})
export class AdministrationDictRepair {

    private loading: boolean = false;
    private sqlresult: string = '';
    private dbErrors: any = [];

    constructor(private backend: backend, private toast: toast, private language: language) {
    }


    private doRepair() {
        this.loading = true;
        this.backend.postRequest('dictionary/repair').subscribe((result: any) => {
            if (!result.response) {
                this.dbErrors = result.errors;
            } else if (result.synced) {
                this.toast.sendToast(this.language.getLabel('LBL_REPAIR_DATABASE_ALREADY_SYNCED'), 'success');
            } else {
                this.sqlresult = result.sql;
                this.toast.sendToast(this.language.getLabel('LBL_REPAIR_DATABASE_SYNCED'), 'success');
            }
            this.loading = false;
        });
    }

}
