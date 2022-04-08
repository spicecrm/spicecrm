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
    selector: "object-timeline-auditlog-modal",
    templateUrl: "../templates/objecttimelineauditlogmodal.html"
})
export class ObjectTimelineAuditlogModal implements OnInit {

    /**
     * referenbce to the modal itself
     */
    public self: any = null;

    /**
     * the audit log records
     *
     * @private
     */
    public auditLog;


    /**
     * indicates that we are loading
     *
     * @private
     */
    public loading: boolean = true;

    public moduleFields: any[] = [];

    constructor(public language: language, public metadata: metadata, @Optional() public model: model) {
    }

    public ngOnInit() {

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
        this.loading = false;
    }

    public hideAuditLog() {
        this.self.destroy();
    }
}
