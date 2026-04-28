import {Component, Injector, OnInit, SkipSelf} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import moment from "moment";



@Component({
    selector: "action-activity-new-occurrence-button",
    templateUrl: "../templates/actionactivitynewoccurrencebutton.html",
    providers: [model],
    standalone: false
})
export class ActionActivityNewOccurrenceButton implements OnInit {

    public displayasicon: boolean = false;
    public actionconfig: any = {};

    constructor(
        @SkipSelf() public parent: model,
        public language: language,
        public metadata: metadata,
        public model: model,
        public relatedmodels: relatedmodels,
        public backend: backend
    ) {}

    ngOnInit() {
        this.model.module = "JourFixeOccurrences";
    }

    public execute() {
        const parentId = this.parent.getField("id");

        this.backend.getRequest(`module/JourFixes/${parentId}/nextoccurrence`, {}).subscribe(backendResult => {

            let startDateVal = backendResult.date_start ? moment(backendResult.date_start) : null;
            let endDateVal = backendResult.date_end ? moment(backendResult.date_end) : null;

            this.model.id = "";
            this.model.initialize({});

            this.model.setField("date_start", backendResult.date_start);
            this.model.setField("date_end", backendResult.date_end);

            this.model.addModel("", this.parent, {
                    date_start: startDateVal,
                    date_end: endDateVal,
                },null,
                {
                    componentset: this.actionconfig.componentset,
                    actionset: this.actionconfig.actionset,
                }
            ).subscribe(response => {
                if (response) {
                    this.relatedmodels.addItems([response], this.actionconfig.link_name);
                }
            });
        });
    }
}
