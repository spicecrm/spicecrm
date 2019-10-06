/**
 * @module ModuleActivities
 */
import {
    Component,
    OnInit,
    Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

/**
 * renders a bar with quick add sysmbols to be rendered in the model popover
 */
@Component({
    selector: 'activities-popover-addbar-button',
    templateUrl: './src/modules/activities/templates/activitiespopoveraddbarbutton.html',
    providers: [model]
})
export class ActivitiesPopoverAddBarButton {

    /**
     * the module we are creating here
     */
    @Input() private module: string = '';

    /**
     * the parent element
     */
    @Input() private parent: any;

    constructor(private model: model, private language: language, private metadata: metadata) {
    }

    /**
     * handle the click and create the model
     */
    private addModel(){
        this.model.module = this.module;
        this.model.addModel('', this.parent);
    }
}
