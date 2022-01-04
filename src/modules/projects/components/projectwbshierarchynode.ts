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
    templateUrl: "../templates/projectwbshierarchynode.html",
    providers: [model, view],
    host: {
        "[attr.aria-level]": "nodedata.level"
    }
})
export class ProjectWBSHierarchyNode implements OnInit {
    /**
     * the data from teh members
     */
    @Input() public nodedata: any = {};

    /**
     * the fields to be dispalayed
     */
    @Input() public fields: any[] = [];

    /**
     *
     * @private
     */
    public loading: boolean = false;

    constructor(public language: language, public metadata: metadata, public projectwbsHierarchy: projectwbsHierarchy, public model: model, public view: view) {
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = "ProjectWBSs";
        this.model.id = this.nodedata.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.nodedata.data);
    }

    get expandable() {
        return this.nodedata.member_count > 0;
    }

    /**
     * returns information if node is expanded or not
     * @private
     */
    public isExpandedNode() {
        return this.nodedata.expanded;
    }

    /**
     * expands or collapses node depending on current state
     * @private
     */
    public expandNode() {
        if (this.isExpandedNode()) {
            this.projectwbsHierarchy.collapse(this.nodedata.id);
        } else {
            this.loading = true;
            this.projectwbsHierarchy.expand(this.nodedata.id);
        }
    }


}
