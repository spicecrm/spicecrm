/**
 * @module ObjectComponents
 */
import {Component, OnInit, Optional} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";

/**
 * renders the modal with the audiot log
 */
@Component({
    selector: "object-action-auditlog-modal",
    templateUrl: "../templates/objectactionauditlogmodal.html"
})
export class ObjectActionAuditlogModal implements OnInit {

    /**
     * referenbce to the modal itself
     */
    public self: any = null;

    /**
     * the audit log records
     *
     * @private
     */
    public auditLog: any[] = [];

    /**
     * the list of transaction IDs
     *
     * @private
     */
    public auditTransactions: any[] = [];

    /**
     * indicates that we are loading
     *
     * @private
     */
    public loading: boolean = true;

    public moduleFields: any[] = [];

    public _userfilter: string = '';
    public _fieldfilter: string = '';

    constructor(public language: language, public metadata: metadata, @Optional() public model: model) {
    }

    get userfilter() {
        return this._userfilter;
    }

    set userfilter(filtervalue) {
        this._userfilter = filtervalue;
        this.loadAuditLog();
    }

    get fieldfilter() {
        return this._fieldfilter;
    }

    set fieldfilter(filtervalue) {
        this._fieldfilter = filtervalue;
        this.loadAuditLog();
    }

    public ngOnInit() {
        // kick off laoding the log
        this.loadAuditLog();

        // get the fields for the module
        for (let field in this.metadata.getModuleFields(this.model.module)) {
            this.moduleFields.push({
                name: field,
                display: this.language.getFieldDisplayName(this.model.module, field)
            });
        }
        // sort the fields by display
        this.moduleFields.sort((a, b) => {
            return a.display.toLowerCase() > b.display.toLowerCase() ? 1 : -1;
        });

    }

    public hideAuditLog() {
        this.self.destroy();
    }

    /**
     * load ths audit log for the bean
     */
    public loadAuditLog() {
        if (this.model) {
            this.auditLog = [];
            this.auditTransactions = [];

            this.loading = true;
            this.model.getAuditLog({user: this._userfilter, field: this._fieldfilter, grouped: true}).subscribe(
                log => {
                    this.auditLog = log;

                    // extract the transaction IDs
                    for(let logEntry of this.auditLog){
                        if(this.auditTransactions.indexOf(logEntry.transaction_id) == -1){
                            this.auditTransactions.push({
                                transaction_id: logEntry.transaction_id,
                                created_by: logEntry.created_by,
                                user_name: logEntry.user_name,
                                date_created: logEntry.date_created
                            });
                        }
                    }

                    this.loading = false;
                },
                error => {
                    this.loading = false;
                });
        }
    }
}
