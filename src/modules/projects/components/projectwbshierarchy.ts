import {Component, AfterViewInit, OnInit, OnDestroy, OnChanges} from "@angular/core";
import {model} from "../../../services/model.service";
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

    constructor(private language: language, private metadata: metadata, private projectwbsHierarchy: projectwbsHierarchy, private model: model, private relatedmodels: relatedmodels) {
        this.relatedmodels.relatedModule = "ProjectWBSs";

        this.relatedmodels.items$.subscribe(items =>{
            this.projectwbsHierarchy.loadHierarchy();
        });

    }

    private loadHierarchy() {
        this.projectwbsHierarchy.project_id = this.model.id;
        this.projectwbsHierarchy.requestedFields = this.fieldsetFields;

        this.projectwbsHierarchy.loadHierarchy();
    }

    public ngOnInit() {
        this.fieldsetFields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);

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
