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
import {userpreferences} from "../../services/userpreferences.service";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'field-date-time',
    templateUrl: '../templates/fielddatetime.html'
})
export class fieldDateTime extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    get displayValue() {
        try {
            if (this.model.getField(this.fieldname)) {
                let date = this.model.getField(this.fieldname);
                if (date.isValid()) {
                    if (this.fieldconfig.displayfromnow) {
                        return date.fromNow();
                    } else {
                        return date.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
                    }
                } else {
                    return '';
                }
            } else {
                return '';
            }
        } catch (e) {
            return '';
        }
    }

    get displaySpan() {
        try {
            if (this.model.getField(this.fieldname)) {
                let date = this.model.getField(this.fieldname);
                if (date.isValid()) {
                    return date.fromNow();
                } else {
                    return '';
                }
            } else {
                return '';
            }
        } catch (e) {
            return '';
        }
    }

    get displayDate() {
        try {
            if (this.model.getField(this.fieldname)) {
                let date = this.model.getField(this.fieldname);
                if (date.isValid()) {

                    return date.format(this.userpreferences.getDateFormat());
                } else {
                    return '';
                }
            } else {
                return '';
            }
        } catch (e) {
            return '';
        }
    }

    get displayTime() {
        try {
            if (this.model.getField(this.fieldname)) {
                let date = this.model.getField(this.fieldname);
                if (date.isValid()) {

                    return date.format(this.userpreferences.getTimeFormat());
                } else {
                    return '';
                }
            } else {
                return '';
            }
        } catch (e) {
            return '';
        }
    }

    /**
     * set the field to invalid, tied to the emitter on the system-date
     *
     * @param valid
     */
    public setValid(valid){
        if(!valid){
            this.setFieldError(this.language.getLabel('LBL_INPUT_INVALID'));
        } else {
            this.clearFieldError();
        }
    }

    get highlightdate() {
        return (this.fieldconfig.highlightpast == 1 || this.fieldconfig.highlightpast === true) && new moment() > new moment(this.model.getField(this.fieldname)) ? true : false;
    }
}
