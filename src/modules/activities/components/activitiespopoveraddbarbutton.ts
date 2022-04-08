/**
 * @module ModuleActivities
 */
import {
    Component,
    OnInit,
    Input,
    Optional
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {relatedmodels} from '../../../services/relatedmodels.service';

/**
 * renders a bar with quick add sysmbols to be rendered in the model popover
 *
 * The new model is added with two parents. Priority has the related if one is set. then the model itself. This allows executing multiple copy rules
 */
@Component({
    selector: 'activities-popover-addbar-button',
    templateUrl: '../templates/activitiespopoveraddbarbutton.html',
    providers: [model]
})
export class ActivitiesPopoverAddBarButton {

    /**
     * the module we are creating here
     */
    @Input() public module: string = '';

    /**
     * the parent element
     */
    @Input() public parent: any;

    constructor(public model: model, public language: language, public metadata: metadata, @Optional() public relatedmodels: relatedmodels) {
    }

    /**
     * handle the click and create the model
     */
    public addModel() {
        this.model.module = this.module;

        // set the parents
        let parents = [this.parent];
        if (this.relatedmodels && this.relatedmodels.model) parents.push(this.relatedmodels.model);

        this.model.addModel('', parents);
    }
}
