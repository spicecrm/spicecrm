/**
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer2} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {userpreferences} from '../../services/userpreferences.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
* @ignore
*/
/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'field-date',
    templateUrl: './src/objectfields/templates/fielddate.html',
    providers: [popup]
})
export class fieldDate extends fieldGeneric {
    private showDatePicker: boolean = false;
    private isValid: boolean = true;
    private errorMessage: string = '';
    private popupSubscription: any = undefined;
    private clickListener: any = undefined;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private popup: popup, private renderer: Renderer2, private elementRef: ElementRef, private userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
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

    get highlightdate() {
        return this.fieldconfig.highlightpast && this.value && new moment() > new moment(this.model.getField(this.fieldname)) ? true : false;
    }
}
