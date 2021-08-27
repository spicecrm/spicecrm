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
    /**
     * the component config
     * @private
     */
    private componentconfig: any = {};

    /**
     * the fieldsets to be displayed
     * @private
     */
    private fieldsetFields: any[] = [];

    constructor(private language: language, private metadata: metadata, private projectwbsHierarchy: projectwbsHierarchy, private model: model, private relatedmodels: relatedmodels, private broadcast: broadcast) {

        // needed for the button in the actionset
        this.relatedmodels.relatedModule = "ProjectWBSs";

        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });

    }

    /**
     * handles message coming from broadcasting
     * Reloads hierarchy if conditions are matched
     * @param message
     * @private
     */
    private handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagetype.indexOf("model") === -1 || message.messagedata.module !== "ProjectWBSs" || (message.messagedata.module === "ProjectWBSs" && message.messagetype === "model.loaded")) {
            return;
        }

        this.loadHierarchy();
    }

    /**
     * calls hierarchy service and load data
     * @private
     */
    private loadHierarchy() {
        this.projectwbsHierarchy.project_id = this.model.id;
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

    /**
     * used to display spinner when hiearchy container is being laoded
     * @private
     */
    private isLoading() {
        return this.projectwbsHierarchy.isloading;
    }

}
