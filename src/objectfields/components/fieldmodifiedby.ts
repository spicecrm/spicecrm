/**
 * @module ObjectFields
 */
import {Component, ElementRef,} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';
import {fieldRelate} from "./fieldrelate";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {backend} from "../../services/backend.service";
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'field-generic',
    templateUrl: '../templates/fieldmodifiedby.html'
})
export class fieldModifiedBy extends fieldRelate {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public elementRef: ElementRef, public modal: modal, public backend: backend, public toast: toast, public userpreferences: userpreferences) {
        super(model, view, language, metadata, router, elementRef, modal, backend, toast);
    }

    get datefield() {
        return this.fieldconfig.field_date ? this.fieldconfig.field_date : 'date_modified';
    }


    get displayDate() {
        try {
            if (this.model.getField(this.fieldname)) {
                let date = this.model.getFieldValue(this.datefield);
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
                let date = this.model.getFieldValue(this.datefield);
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

}
