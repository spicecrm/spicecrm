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
declare var moment: any;

@Component({
    selector: 'field-date-time-duration',
    templateUrl: './src/objectfields/templates/fielddatetimeduration.html'
})
export class fieldDateTimeDuration extends fieldGeneric {
    /**
     * values for the duration in hours
     */
    private durationHours: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    /**
     * values for the duration in minutes
     */
    private durationMinutes: string[] = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    get fieldstart() {
        return this.fieldconfig.field_start ? this.fieldconfig.field_start : 'date_start';
    }

    get fieldend() {
        return this.fieldconfig.field_end ? this.fieldconfig.field_end : 'date_end';
    }

    get dateEnd() {
        return this.model.getField(this.fieldend);
    }

    get currentHours() {
        if(!this.dateEnd) return 0;

        let duration = moment.duration(this.dateEnd.diff(this.value));
        return duration.get('hours');
    }

    get currentMinutes() {
        if(!this.dateEnd) return 0;

        let duration = moment.duration(this.dateEnd.diff(this.value));
        return duration.get('minutes');
    }

    get editDurationHours() {
        return this.currentHours; // this.model.data[this.fieldhours];
    }

    set editDurationHours(hours) {
        let cMinutes = this.currentMinutes;
        let end = new moment(this.value);
        end.add(hours, 'h').add(cMinutes, 'm');
        this.model.setField(this.fieldend, end);
    }

    get editDurationMinutes() {
        return this.currentMinutes; // this.model.data[this.fieldminutes];
    }

    set editDurationMinutes(minutes) {
        let cHours = this.currentHours;
        let end = new moment(this.value);
        end.add(cHours, 'h').add(minutes, 'm');
        this.model.setField(this.fieldend, end);
    }

    private getDisplay() {
        if (this.model.data.date_start) {
            if(this.dateEnd) {
                return this.model.data.date_start.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat()) + ' - ' + this.model.data.date_end.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
            } else {
                return this.model.data.date_start.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
            }
        }
    }

}
