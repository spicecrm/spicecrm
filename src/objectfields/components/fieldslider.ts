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
import {field} from "./field";

@Component({
    selector: 'field-slider',
    templateUrl: '../templates/fieldslider.html'
})
export class fieldSlider extends fieldGeneric {
    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get min(): number {
        return this.fieldconfig.min ? parseInt(this.fieldconfig.min, 10) : 0;
    }

    get max(): number {
        return this.fieldconfig.max ? parseInt(this.fieldconfig.max, 10) : 100;
    }

    get step(): number {
        return this.fieldconfig.step ? parseInt(this.fieldconfig.step, 10) : 10;
    }

    /**
     * override the getter to set the value defaulting to 0
     */
    get value(): number {
        let fieldValue = this.model.getField(this.fieldname);
        return fieldValue ? (typeof(fieldValue) == 'number' ? fieldValue : parseInt(fieldValue, 10)) : 0;
    }

    /**
     * a setter thjat returns the value to the model and triggers the validation
     *
     * @param val the new value
     */
    set value(val) {
        this.model.setField(this.fieldname, val);
    }

    get completion() {
        return (this.value - this.min) / (this.max - this.min) * 100;
    }
}
