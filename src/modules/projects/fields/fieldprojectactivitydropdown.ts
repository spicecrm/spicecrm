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
    private options: any = [];
    private disabled: boolean = true;

    constructor(public backend: backend, public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.getActivityTypes();
    }

    /**
     * getter for the value
     */
    public getValue() {
        return this.model.getFieldValue("projectactivitytype_name")
    }

    /**
     * set value
     */
    public setValue() {
        this.model.setField(this.fieldid, this.value);
    }
    /**
     * gets the ProjectActivityTypes options for a ProjectActivity
     */
    public getActivityTypes() {
        this.backend.getRequest(`activitytypes/${this.model.id}`).subscribe(result => {
            if (result.activitytypes.length > 0) {
                this.options = result.activitytypes;
                this.disabled = false;
            }
        });
    }
}
