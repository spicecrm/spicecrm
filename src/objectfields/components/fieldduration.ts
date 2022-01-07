/**
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer2} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

/**
* @ignore
*/
/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'field-duration',
    templateUrl: '../templates/fieldduration.html',

})
export class fieldDuration extends fieldGeneric {
    public isValid: boolean = true;
    public durationHours: string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    public durationMinutes: string[] = ['00', '15', '30', '45'];

    get fieldminutes() {
        return this.fieldconfig.field_minutes ? this.fieldconfig.field_minutes : 'duration_minutes';
    }

    get fieldhours() {
        return this.fieldconfig.field_hours ? this.fieldconfig.field_hours : 'duration_hours';
    }

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }

    public getDisplay() {
        if (this.model.getField(this.fieldminutes) || this.model.getField(this.fieldhours)) {
            // return this.model.data[this.fieldhours] + ':' + this.model.data[this.fieldminutes];
            return ("00" + this.model.getField(this.fieldhours)).slice(-2)  + ':' + ("00" + this.model.getField(this.fieldminutes)).slice(-2);
        }
    }

    /*
     * toggle the datepicker and subscribe to the close event
     */


    get editDurationHours() {
        return this.model.getField(this.fieldhours);
    }

    set editDurationHours(hours) {
        this.model.setField(this.fieldhours, hours);
    }

    get editDurationMinutes() {
        return this.model.getField(this.fieldminutes);
    }

    set editDurationMinutes(minutes) {
        this.model.setField(this.fieldminutes, minutes);
    }

}
