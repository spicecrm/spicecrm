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
    /**
     * variable to set the field disabled
     * @private
     */
    private disabled: boolean = true;

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
     * gets the ProjectActivityTypes options for a ProjectPlannedActivity
     */
    public getActivityTypes() {
        let projectwbsid = this.model.getField('projectwbs_id');
        this.backend.getRequest(`activitytypes/${projectwbsid}`).subscribe(result => {
            if (result.activitytypes.length > 0) {
                this.options = result.activitytypes;
                this.disabled = false;
            }
        });
    }
}
