/**
 * @module ModuleProjects
 */
import {Component, OnInit, SkipSelf} from "@angular/core";
import {model} from "../../../services/model.service";


@Component({
    selector: "projectwbs-hierarchy-addnode",
    templateUrl: "../templates/projectwbshierarchyaddnode.html",
    providers: [model]
})
export class ProjectWBSHierarchyAddNode  {

    constructor( public model: model,@SkipSelf() public parent: model) {

    }

    public execute(){
        this.model.module = 'ProjectWBSs';
        this.model.id = null;
        this.model.addModel(null, this.parent);
    }

}
