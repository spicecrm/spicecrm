import {Component, ElementRef, Renderer} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

declare var moment: any;

@Component({
    selector: 'field-duration',
    templateUrl: './src/objectfields/templates/fieldduration.html',
    providers: [popup]
})
export class fieldDuration extends fieldGeneric {
    private isValid: boolean = true;
    errorMessage: String = '';
    durationHours: Array<string> = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    durationMinutes: Array<string> = ['00', '15', '30', '45'];

    get fieldminutes() {
        return this.fieldconfig['field_minutes'] ? this.fieldconfig['field_minutes'] : 'duration_minutes';
    }

    get fieldhours() {
        return this.fieldconfig['field_hours'] ? this.fieldconfig['field_hours'] : 'duration_hours';
    }

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private popup: popup, private renderer: Renderer, private elementRef: ElementRef) {
        super(model, view, language, metadata, router);

    }

    getDisplay() {
        if (this.model.data[this.fieldminutes] || this.model.data[this.fieldhours]) {
            // return this.model.data[this.fieldhours] + ':' + this.model.data[this.fieldminutes];
            return ("00" + this.model.data[this.fieldhours]).slice(-2)  + ':' + ("00" + this.model.data[this.fieldminutes]).slice(-2);
        }
    }

    /*
     * toggle the datepicker and subscribe to the close event
     */


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

}