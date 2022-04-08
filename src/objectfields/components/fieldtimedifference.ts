/**
 * @module ObjectFields
 */
import {Component, ElementRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {popup} from "../../services/popup.service";

/**
 * renders a field for a numerical value and a timeunit. Used to define a timespan resp tiomediffernece that can later on be evaluated e.g. in Formulas, SLAs etc
 */
@Component({
    selector: 'field-time-difference',
    templateUrl: '../templates/fieldtimedifference.html'
})
export class fieldTimeDifference extends fieldGeneric {

    /**
     * internal to keep the unit
     */
    public _timedifferenceunit: string;

    /**
     * internal to keep the span
     */
    public _timedifferencespan: number;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    /**
     * simpel getter speartaing the value
     */
    get timedifferenceunit() {
        if (this._timedifferenceunit) return this._timedifferenceunit;
        if (this.value) {
            return this.value.split(' ')[1];
        }
        return 'h';
    }

    /**
     * setter for the unit to also set the value of the model if thboth values are set
     *
     * @param value
     */
    set timedifferenceunit(value) {
        this._timedifferenceunit = value;
        this.updateModel();
    }

    /**
     * simple getter for teh value
     */
    get timedifferencespan() {
        if (this._timedifferencespan) return this._timedifferencespan;
        if (this.value) {
            return this.value.split(' ')[0];
        }
        return '';
    }

    /**
     * simple setter for teh value also setting the value field on the model
     *
     * @param value
     */
    set timedifferencespan(value) {
        this._timedifferencespan = value;
        this.updateModel();
    }

    /**
     * sets the model value via the value setter on the generic field
     */
    public updateModel() {
        if (this._timedifferencespan > 0 && this.timedifferenceunit) {
            this.value = this.timedifferencespan + ' ' + this._timedifferenceunit;
        } else {
            this.value = '';
        }
    }

}
