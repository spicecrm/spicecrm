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
    templateUrl: "./src/objectcomponents/templates/objecttimelineauditdetail.html"
})
export class ObjectTimelineAuditDetail {

    /**
     * the audit log records
     *
     * @private
     */
    @Input() private auditLog;

    private loading: boolean = true;

    constructor(private language: language, private metadata: metadata, @Optional() private model: model) {
    }

    public ngOnChanges() {
        this.loading = false;
    }
}
