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
    templateUrl: '../templates/administrationdictrepairmodal.html'
})
export class AdministrationDictRepairModal {

    /**
     * flag for synchronisation
     * @private
     */
    public synced:boolean = false;
    /**
     * array container for the statements
     * @private
     */
    public sql: any =[];
    /**
     * whole untouched sql string
     * @private
     */
    public wholeSQL: string;
    /**
     * array container of database errors from backend
     * @private
     */
    public dbErrors: any = [];
    /**
     * modal reference
     * @private
     */
    public self: any = {};
    constructor(public backend: backend, public toast: toast, public language: language, public modal: modal) {
    }

    /**
     * destroy modal instance
     * @private
     */
    public close() {
        this.self.destroy();
    }

    /**
     * hides copy to clipboard button if clipoard is undefined
     */
    get hidden() {
        return typeof navigator.clipboard == undefined;
    }

    /**
     * execute db repair and save the response
     */
    public doRepair() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            const selectedqueries = this.sql.filter(query => query.selected);
        this.backend.postRequest('admin/repair/database', {}, {selectedqueries}).subscribe((result: any) => {
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
        },
        (err: any) => {
                switch (err.status) {
                    case 500:
                        this.toast.sendAlert(err.message, 'error');
                        this.close();
                        loadingRef.instance.self.destroy();
                        break;
                }
            });
        });
    }



    /**
     * copy the selected SQL statements to the clipboard
     */
    public copy2clipboard() {
        const selectedQueries = this.sql.filter(query => query.selected);
        const selectedStatements = selectedQueries.map(query => query.statement);
        const text = selectedStatements.toString().replace(/;,/g, ';\n');
        navigator.clipboard.writeText(text).then(success => {
            this.toast.sendToast(this.language.getLabel('LBL_COPIED_TO_CLIPBOARD'), "info");
        });
    }

    /**
     * selects all the queries
     */
    public selectAll() {
     this.sql.forEach(query => {query.selected = true});
    }

}

