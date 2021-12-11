/**
 * @module ModuleWorkflow
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {configurationService} from '../../../services/configuration.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

/**
 * renders a field specific to the workflow task name that will not link to the workflow task but to the parent object
 */
@Component({
    selector: 'field-wokflowtask-name',
    templateUrl: '../templates/fieldworkflowtaskname.html'
})
export class fieldWorkflowTaskName extends fieldGeneric implements OnInit {

    public noLinkFieldConfig: any = {};

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public configuration: configurationService) {
        super(model, view, language, metadata, router);

    }

    public ngOnInit() {
        super.ngOnInit();

        // disable the link int he fconfig so the generic field will not render a popover or link
        this.noLinkFieldConfig = {...this.fieldconfig};
        this.noLinkFieldConfig.link = false;

    }

    get parentModule() {
        return this.model.getField('parent_type');
    }

    get parentId() {
        return this.model.getField('parent_id');
    }

}
