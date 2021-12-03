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
    selector: 'field-project-activity-duration',
    templateUrl: './src/modules/projects/templates/fieldprojectactivityduration.html',

})
export class fieldProjectActivityDuration extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get minutes() {
        let minutes = this.value / 60 - (parseInt(this.hours, 10) * 60)
        return minutes < 10 ? '0' + minutes : minutes.toString();
    }

    set minutes(value) {
        this.value = parseInt(this.hours, 10) * 3600 + parseInt(value, 10) * 60;
    }

    get hours() {
        let hours = Math.floor(this.value / 3600);
        return hours < 10 ? '0' + hours : hours.toString();
    }

    set hours(value){
        this.value = parseInt(value, 10) * 3600 + parseInt(this.minutes, 10) * 60;
    }
}
