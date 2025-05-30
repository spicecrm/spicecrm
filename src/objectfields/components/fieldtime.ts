/**
 * @module ObjectFields
 */
import {Component, inject, OnInit} from '@angular/core';
import {userpreferences} from '../../services/userpreferences.service';
import {fieldGeneric} from './fieldgeneric';


/**
 * @ignore
 */
/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'field-time',
    templateUrl: '../templates/fieldtime.html',
    standalone: false
})
export class fieldTime extends fieldGeneric implements OnInit {

    /**
     * injected instance of the user perference service
     */
    public userPreferences: userpreferences = inject(userpreferences);
    /**
     * holds the utc value of the original value
     */
    public valueUtc;

    ngOnInit() {
        super.ngOnInit();

        this.setValueUtc(this.value);

        this.subscriptions.add(
            this.model.observeFieldChanges(this.fieldname).subscribe(value => {
                this.setValueUtc(value);
            })
        );
    }

    /**
     * set utc value to prevent changing the hour on timezone change
     * @param value
     * @private
     */
    private setValueUtc(value) {
        this.valueUtc = !value ? null : moment.utc(value);
    }

    /**
     * returns the time in the users time format
     */
    get displayTime() {
        return this.valueUtc?.format(this.userPreferences.getTimeFormat());
    }

}
