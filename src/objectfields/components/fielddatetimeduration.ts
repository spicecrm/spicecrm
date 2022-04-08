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
    templateUrl: '../templates/fielddatetimeduration.html'
})
export class fieldDateTimeDuration extends fieldGeneric {
    /**
     * values for the duration in hours
     */
    public durationHours: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    /**
     * values for the duration in minutes
     */
    public durationMinutes: string[] = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

    /**
     * the duration, held internally so we can move the end date when the start date moves
     *
     * @private
     */
    public duration: any;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    /**
     * subscribe to the model data$ changes to have an accurate and up to date duration
     */
    public ngOnInit() {
        super.ngOnInit();

        this.subscriptions.add(
            this.model.data$.subscribe((data) => {
                if (this.value && this.dateEnd) {
                    this.duration = moment.duration(this.dateEnd.diff(this.value));
                }
            })
        );
    }

    get fieldend() {
        return this.fieldconfig.field_end ? this.fieldconfig.field_end : 'date_end';
    }

    /**
     * a getter for the value bound top the model
     */
    get value() {
        return this.model.getField(this.fieldname);
    }

    /**
     * a setter that returns the value to the model and triggers the validation
     *
     * @param val the new value
     */
    set value(val) {
        // build the fields object
        let fields: any = {};
        fields[this.fieldname] = val;

        if (this.duration) {
            // calculate the new end date
            let newEndDate = new moment(val).add(this.duration.asSeconds(), 's');

            // add the end date
            fields[this.fieldend] = newEndDate;
        }

        // set the fields on the model
        this.model.setFields(fields);
    }

    /**
     * getter for the end date
     */
    get dateEnd() {
        return this.model.getField(this.fieldend);
    }

    /**
     * returns the hours from teh duration object
     */
    get currentHours() {
        if (!this.duration) return 0;
        return this.duration.get('hours');
    }

    /**
     * returns the minuts from the duration object
     */
    get currentMinutes() {
        if (!this.duration) return 0;
        return this.duration.get('minutes');
    }

    /**
     * returns the number of hours from the duration
     */
    get editDurationHours() {
        return this.currentHours; // this.model.data[this.fieldhours];
    }

    /**
     * sets the new hours and calcuates the new end date
     *
     * @param hours
     */
    set editDurationHours(hours) {
        let cMinutes = this.currentMinutes;
        let end = new moment(this.value);
        end.add(hours, 'h').add(cMinutes, 'm');
        this.model.setField(this.fieldend, end);
    }

    /**
     * getter for the duration minutes
     */
    get editDurationMinutes() {
        return this.currentMinutes; // this.model.data[this.fieldminutes];
    }

    /**
     * setter for the duration minutes
     *
     * @param minutes
     */
    set editDurationMinutes(minutes) {
        let cHours = this.currentHours;
        let end = new moment(this.value);
        end.add(cHours, 'h').add(minutes, 'm');
        this.model.setField(this.fieldend, end);
    }

}
