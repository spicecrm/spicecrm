/**
 * @module ModuleProjects
 */
import {Component, input} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {projectwbsHierarchy} from '../services/projectwbshierarchy.service';
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";

@Component({
    selector: 'project-wbs-element',
    templateUrl: '../templates/projectwbselement.html',
    standalone: false,
    providers: [model, view]
})
export class ProjectWBSElement {

    /**
     * wbs element data to be used when initializing the model
     */
    public element = input<any>({});

    /**
     * index of the element in array
     */
    public index = input<any>();

    /**
     * fields in the fieldset to be rendered
     */
    public fieldsetFields: any[] = [];

    constructor(public model: model,
                public modellist: modellist,
                public projectwbsHierarchy: projectwbsHierarchy,
                public view: view,
                public metadata: metadata)
    {
        let componentconfig = this.metadata.getComponentConfig('ProjectWBSElement', 'ProjectWBSs');
        if (componentconfig.fieldset) {
            this.fieldsetFields = this.metadata.getFieldSetItems(componentconfig.fieldset);
        }

        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = 'ProjectWBSs';
        this.model.id = this.element().id;
        this.model.setData(this.element());
    }

    public selectProjectElement() {
        this.projectwbsHierarchy.project_id.set(this.model.id);
    }
}