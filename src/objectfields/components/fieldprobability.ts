/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-probability',
    templateUrl: '../templates/fieldprobability.html'
})
export class fieldProbability extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
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
        this.model.setField(this.fieldname, val);

        // set the validity
        this.setValid(val >= 0 && val <= 100)
    }

    /**
     * set the field to invalid, tied to the emitter on the system-date
     *
     * @param valid
     */
    public setValid(valid){
        if(!valid){
            this.setFieldError(this.language.getLabel('LBL_PROBABILITY_INVALID'));
        } else {
            this.clearFieldError();
        }
    }
}
