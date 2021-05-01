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
    templateUrl: "./src/objectcomponents/templates/objectactionauditlogmodal.html"
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
    private auditLog: any[] = [];

    /**
     * the list of transaction IDs
     *
     * @private
     */
    private auditTransactions: any[] = [];

    /**
     * indicates that we are loading
     *
     * @private
     */
    private loading: boolean = true;

    private moduleFields: any[] = [];

    private _userfilter: string = '';
    private _fieldfilter: string = '';

    constructor(private language: language, private metadata: metadata, @Optional() private model: model) {
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

    private hideAuditLog() {
        this.self.destroy();
    }

    /**
     * load ths audit log for the bean
     */
    private loadAuditLog() {
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
