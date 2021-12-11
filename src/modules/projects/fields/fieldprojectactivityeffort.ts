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
    templateUrl: '../templates/fieldprojectactivityeffort.html',

})
export class fieldProjectActivityEffort extends fieldGeneric {


    get fieldstart() {
        return this.fieldconfig.fieldstart ? this.fieldconfig.fieldstart : 'activity_start';
    }

    get fieldend() {
        return this.fieldconfig.fieldend ? this.fieldconfig.fieldend : 'activity_end';
    }

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }

    get value() {
        let start = this.model.getField(this.fieldstart);
        let end = this.model.getField(this.fieldend);
        if (start && end) {
            let duration = moment.duration(end.diff(start));
            return duration.get('hours') + ':' + duration.get('minutes');
        }

        // no dates found
        return '';
    }

}
