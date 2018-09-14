import { Component, Input, OnInit, Optional} from "@angular/core";
import { metadata } from "../../services/metadata.service";
import { model } from "../../services/model.service";
import { language } from "../../services/language.service";

@Component({
    selector: "object-action-auditlog-modal",
    templateUrl: "./src/objectcomponents/templates/objectactionauditlogmodal.html"
})
export class ObjectActionAuditlogModal implements OnInit {

    public self: any = null;

    private auditLog: Array<any> = [];
    private loading: boolean = true;

    constructor( private language: language, private metadata: metadata, @Optional() private model: model ) {}

    public ngOnInit() {
        if(this.model) {
            this.model.getAuditLog().subscribe(log => {
                this.auditLog = log;
                this.loading = false;
            });
        }
    }

    private hideAuditLog() {
        this.self.destroy();
    }
}
