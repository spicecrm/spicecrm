/**
 * @module moduleProjects
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {fieldGeneric} from '../../../objectfields/components/fieldgeneric';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'field-project-activity-effort',
    templateUrl: '../templates/fieldprojectplannedactivityconsumption.html',

})
export class fieldProjectPlannedActivityConsumption extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get duration() {
        let duration = moment.duration(this.value, 'minutes');
        return duration.get('hours') + (duration.get('minutes') < 10 ? ':0' : ':') + duration.get('minutes');
    }

    get percentage(){
        return Math.round((this.value / 60) / this.model.getField('effort') * 100);
    }

}
