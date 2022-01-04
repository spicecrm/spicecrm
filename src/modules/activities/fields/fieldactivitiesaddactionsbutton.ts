/**
 * @module ModuleActivities
 */
import {
    Component, Input,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {ActivitiesPopoverAddBarButton} from "../components/activitiespopoveraddbarbutton";

/**
 * renders a bar with quick add sysmbols to be rendered in the model popover
 */
@Component({
    selector: '[field-activities-addactions-button]',
    templateUrl: '../templates/fieldactivitiesaddactionsbutton.html',
    providers: [model],
    host:{
        '(click)': 'addModel()'
    }
})
export class fieldActivitiesAddActionsButton extends ActivitiesPopoverAddBarButton {

}
