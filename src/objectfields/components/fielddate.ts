import {Component, ElementRef, Renderer} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {userpreferences} from '../../services/userpreferences.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

declare var moment: any;

@Component({
    selector: 'field-date',
    templateUrl: './src/objectfields/templates/fielddate.html',
    providers: [popup]
})
export class fieldDate extends fieldGeneric {
    private showDatePicker: boolean = false;
    private isValid: boolean = true;
    private errorMessage: String = '';
    private popupSubscription: any = undefined;
    private clickListener: any = undefined;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private popup: popup, private renderer: Renderer, private elementRef: ElementRef, private userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    /*
     * toggle the datepicker and subscribe to the close event
     */
    private toggleDatePicker() {

        this.showDatePicker = !this.showDatePicker;
        if (this.showDatePicker) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
            this.popupSubscription = this.popup.closePopup$.subscribe(event => {
                this.showDatePicker = false;
                this.clickListener();
                this.popupSubscription.unsubscribe();
            });
        } else {
            this.popupSubscription.unsubscribe();
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.clickListener();
            this.showDatePicker = false;
        }
    }

    set editDate(e: string) {

        if (e.trim() === '') {
            this.model.setField(this.fieldname,  null);
            return;
        }

        let setDate = new moment(e, this.userpreferences.getDateFormat(), true);
        if (setDate.isValid()) {

            // set the time
            if (this.model.getField(this.fieldname) && !isNaN(this.model.getField(this.fieldname).hour())) {
                setDate.hour(this.model.getField(this.fieldname).hour());
                setDate.minute(this.model.getField(this.fieldname).minute());
            }

            // move the start Date
            this.value = setDate;
        }
    }

    get editDate() {
        try {
            if (this.model.getField(this.fieldname)) {
                let date = new moment(this.model.getField(this.fieldname));
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

    set pickerDate(date: any) {
        this.editDate = date.format(this.userpreferences.getDateFormat());
    }

    get pickerDate() {
        let pickerDate = new moment(this.model.getField(this.fieldname));
        if (pickerDate.isValid()) {
            return pickerDate;
        } else {
            return new moment();
        }
    }

    get highlightdate() {
        return this.fieldconfig.highlightpast && this.editDate && new moment() > new moment(this.model.getField(this.fieldname)) ? true : false;
    }
}
