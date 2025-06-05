/**
 * @module ObjectFields
 */
import {Component, inject} from '@angular/core';
import {userpreferences} from '../../services/userpreferences.service';
import {fieldGeneric} from './fieldgeneric';

@Component({
    selector: 'field-time',
    templateUrl: '../templates/fieldtime.html',
    standalone: false
})
export class fieldTime extends fieldGeneric {

    /**
     * injected instance of the user perference service
     */
    public userPreferences: userpreferences = inject(userpreferences);
}
