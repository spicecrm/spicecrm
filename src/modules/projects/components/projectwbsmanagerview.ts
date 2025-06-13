/**
 * @module ModuleProjects
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {projectwbsHierarchy} from "../services/projectwbshierarchy.service";

@Component({
    templateUrl: '../templates/projectwbsmanagerview.html',
    standalone: false,
    providers: [projectwbsHierarchy]
})
export class ProjectWBSManagerView implements OnInit {

    constructor(public model: model,
                public modellist: modellist,
                public projectwbshierarchy: projectwbsHierarchy) {}

    public ngOnInit() {
        this.modellist.setSortField('date_due', 'ASC');
        this.modellist.getListData();
    }
}