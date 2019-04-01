/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {userpreferences} from '../../services/userpreferences.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
* @ignore
*/
/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'field-date-time-duration',
    templateUrl: './src/objectfields/templates/fielddatetimeduration.html'
})
export class fieldDateTimeDuration extends fieldGeneric {
    private durationHours: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    private durationMinutes: Array<string> = ['0', '15', '30', '45'];
    private isValid: boolean = true;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    get fieldstart() {
        return this.fieldconfig.field_start ? this.fieldconfig.field_start : 'date_start';
    }

    get fieldend() {
        return this.fieldconfig.field_end ? this.fieldconfig.field_end : 'date_end';
    }

    get fieldminutes() {
        return this.fieldconfig.field_minutes ? this.fieldconfig.field_minutes : 'duration_minutes';
    }

    get fieldhours() {
        return this.fieldconfig.field_hours ? this.fieldconfig.field_hours : 'duration_hours';
    }

    get minutes() {
        let minutes = 0;
        if (this.model.data[this.fieldhours]) {
            minutes += parseInt(this.model.data[this.fieldhours], 10) * 60;
        }
        if (this.model.data[this.fieldminutes]) {
            minutes += parseInt(this.model.data[this.fieldminutes], 10);
        }

        return minutes;
    }

    get editDurationHours() {
        return this.model.data[this.fieldhours];
    }

    set editDurationHours(hours) {
        this.model.setField(this.fieldhours, hours);
    }

    get editDurationMinutes() {
        return this.model.data[this.fieldminutes];
    }

    set editDurationMinutes(minutes) {
        this.model.setField(this.fieldminutes, minutes);
    }

    private getDisplay() {
        if (this.model.data.date_start) {
            if (!this.model.data.date_end) {
                this.model.data[this.fieldend] = new moment(this.model.data.date_start).add(this.minutes, 'm');
            }

            return this.model.data.date_start.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat()) + ' - ' + this.model.data.date_end.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
        }
    }

}
