/**
 * @module ObjectComponents
 */
import {Component, Input, OnChanges, OnInit, Optional} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";

/**
 * renders the modal with the audiot log
 */
@Component({
    selector: "object-timeline-audit-detail",
    templateUrl: "../templates/objecttimelineauditdetail.html"
})
export class ObjectTimelineAuditDetail {

    /**
     * the audit log records
     *
     * @private
     */
    @Input() public auditLog;

    public loading: boolean = true;

    constructor(public language: language, public metadata: metadata, @Optional() public model: model) {
    }

    public ngOnChanges() {
        this.loading = false;
    }
}
