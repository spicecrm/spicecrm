/**
 * @module moduleProjects
 */
import {Component, OnInit} from '@angular/core';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from "@angular/router";
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'field-project-activity-dropdown',
    templateUrl: './src/modules/projects/templates/fieldprojectactivitydropdown.html',
})

export class fieldProjectActivityDropdown extends fieldGeneric implements OnInit {
    /**
     * holds the options
     * @private
     */
    private options: any = [];

    constructor(public backend: backend, public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    /**
     * retrieves the activitytypes when the component is rendering
     */
    public ngOnInit() {
        super.ngOnInit();
        this.getActivityTypes();
    }

    /**
     * get projectactivitytipe_id from vardefs
     */
    get idField(){
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        return fieldDefs.id_name;
    }

    /**
     * get the condition to set the selection disabled
     * if there is no projectwbs_id, the selection cant be possible
     */
    get isDisabled() {
        return !this.model.getField('projectwbs_id');
    }

    /**
     * gets the ProjectActivityTypes options for a ProjectPlannedActivity
     */
    public getActivityTypes() {
        let projectwbsid = this.model.getField('projectwbs_id');
        this.backend.getRequest(`module/ProjectWBSs/${projectwbsid}/activitytypes`).subscribe(result => {
            if (result.activitytypes.length > 0) {
                this.options = result.activitytypes;
            }
        });
    }
}
