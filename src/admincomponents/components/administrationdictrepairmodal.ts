/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {Md5} from "ts-md5";
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";


@Component({
    selector: 'administration-dict-repair-modal',
    templateUrl: './src/admincomponents/templates/administrationdictrepairmodal.html'
})
export class AdministrationDictRepairModal {

    private synced:boolean = false;
    private sql: string;
    private dbErrors: any = [];
    private self: any = {};
    constructor(private backend: backend, private toast: toast, private language: language, private modal: modal) {
    }

    private close() {
        this.self.destroy();
    }
    /**
     * execute db repair and save the response
     */
    private doRepair() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
        this.backend.postRequest('repair/database').subscribe((result: any) => {
            if (!result.response) {
                this.dbErrors = result.errors;
            } else if (result.synced) {
                this.toast.sendToast(this.language.getLabel('LBL_REPAIR_DATABASE_ALREADY_SYNCED'), 'success');
                this.close();
            } else {
                this.toast.sendToast(this.language.getLabel('LBL_REPAIR_DATABASE_SYNCED'), 'success');
                this.close();
            }
            loadingRef.instance.self.destroy();
        });
        });
    }

    /**
     * converts the sql string into an array of strings
     * @private
     */
    private convertSQL() {
        /**
         * todo: interpolate strings in template
         */
        let cut = this.sql.split("\n").filter(query => !query.includes('*'));
        let queries = cut.map(query => btoa(query));
        console.log(cut);
        console.log(queries);
    }


    /**
     * copy the SQL to clipboard
     */
    private copy2clipboard() {
        navigator.clipboard.writeText(this.sql).then(success => {
            this.toast.sendToast(this.language.getLabel('LBL_COPIED_TO_CLIPBOARD'), "info");
        });
    }

}
