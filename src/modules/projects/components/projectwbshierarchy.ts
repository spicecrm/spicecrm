/**
 * @module ModuleProjects
 */
import {Component, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {broadcast} from "../../../services/broadcast.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {projectwbsHierarchy} from "../services/projectwbshierarchy.service";

@Component({
    selector: "projectwbs-hierarchy",
    templateUrl: "./src/modules/projects/templates/projectwbshierarchy.html",
    providers: [projectwbsHierarchy, relatedmodels]
})
export class ProjectWBSHierarchy implements OnInit {
    private componentconfig: any = {};
    private fieldsetFields: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private projectwbsHierarchy: projectwbsHierarchy, private model: model, private relatedmodels: relatedmodels, private broadcast: broadcast) {

        // needed for the button in the actionset
        this.relatedmodels.relatedModule = "ProjectWBSs";

        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });

    }

    private handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagetype.indexOf("model") === -1 || message.messagedata.module !== "ProjectWBSs") {
            return;
        }

        this.loadHierarchy();
    }

    private loadHierarchy() {
        this.projectwbsHierarchy.project_id = this.model.id;
        this.projectwbsHierarchy.requestedFields = this.fieldsetFields;

        this.projectwbsHierarchy.loadHierarchy();
    }

    public ngOnInit() {
        this.fieldsetFields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);

        // relate model set needed for the button in the actionset
        if(this.componentconfig.link) {
            this.relatedmodels.linkName = this.componentconfig.link;
        }
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;

        this.loadHierarchy();
    }

    private addSelectedItems(items) {
        this.loadHierarchy();
    }
}
