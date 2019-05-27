/**
 * @module ModuleProjects
 */
import {Component, OnInit, Input} from "@angular/core";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

import {projectwbsHierarchy} from "../services/projectwbshierarchy.service";

@Component({
    selector: "[projectwbs-hierarchy-node]",
    templateUrl: "./src/modules/projects/templates/projectwbshierarchynode.html",
    providers: [model, view],
    host: {
        "[attr.aria-level]": "nodedata.level"
    }
})
export class ProjectWBSHierarchyNode implements OnInit {
    @Input() public nodedata: any = {};
    @Input() public fields: Array<any> = [];
    private loading: boolean = false;

    constructor(private language: language, private metadata: metadata, private projectwbsHierarchy: projectwbsHierarchy, private model: model, private view: view) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = "ProjectWBSs";
        this.model.id = this.nodedata.id;
        this.model.data.summary_text = this.nodedata.summary_text;

        // copy fields
        for (let field of this.fields) {
            this.model.data[field.field] = this.nodedata.data[field.field];
        }

        // copy acl
        this.model.data.acl = this.nodedata.data.acl;
    }

    get expandable(){
        return this.nodedata.member_count > 0;
    }

    private expandNode() {
        if (this.nodedata.expanded) {
            this.projectwbsHierarchy.collapse(this.nodedata.id);
        } else {
            this.loading = true;
            this.projectwbsHierarchy.expand(this.nodedata.id);
        }
    }

    private getIcon() {
        switch (this.nodedata.expanded) {
            case false:
                return "chevronright";
            case true:
                return "chevrondown";
        }
    }
}