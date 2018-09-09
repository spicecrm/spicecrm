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
    selector: 'field-date',
    templateUrl: './src/objectfields/templates/fielddate.html',
    providers: [popup]
})
export class fieldDate extends fieldGeneric {
    showDatePicker: boolean = false;
    private isValid: boolean = true;
    errorMessage: String = '';
    popupSubscription: any = undefined;
    clickListener: any = undefined;

    dateFormat: string = 'DD.MM.YYYY';
    timeFormat: string = 'HH:mm';

    /*
     constructor(private el: ElementRef, private model: model, private view: view, private language: language, private metadata: metadata) {
     }
     */

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private popup: popup, private renderer: Renderer, private elementRef: ElementRef) {
        super(model, view, language, metadata, router);
    }

    /*
     * toggle the datepicker and subscribe to the close event
     */
    toggleDatePicker() {

        this.showDatePicker = !this.showDatePicker;
        if (this.showDatePicker) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
            this.popupSubscription = this.popup.closePopup$.subscribe(event => {
                this.showDatePicker = false;
                this.clickListener();
                this.popupSubscription.unsubscribe();
            })
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

        if ( e.trim() === '' ) {
            this.model.data[this.fieldname] = null;
            return;
        }

        let setDate = new moment(e, this.dateFormat, true);
        if (setDate.isValid()) {

            // set the time
            if (this.model.data[this.fieldname] && !isNaN(this.model.data[this.fieldname].hour())) {
                setDate.hour(this.model.data[this.fieldname].hour());
                setDate.minute(this.model.data[this.fieldname].minute());
            }

            // move the start Date
            this.value = setDate;

            //this.clearFieldError();
        } else {
            // if (e.length !== 10) {
            //this.setFieldError(e + ' is not a valid date');
        }
    }

    get editDate() {
        try {
            if (this.model.data[this.fieldname]) {
                let date = new moment(this.model.data[this.fieldname]);
                if (date.isValid()) {
                    return date.format(this.dateFormat);
                }
                else {
                    return '';
                }
            }
            else {
                return '';
            }
        } catch (e) {
            return '';
        }
    }

    set pickerDate(date: any) {
        this.editDate = date.format(this.dateFormat);
    }

    get pickerDate() {
        let pickerDate = new moment(this.model.data[this.fieldname]);
        if (pickerDate.isValid())
            return pickerDate;
        else
            return new moment();
    }

    get highlightdate(){
        return this.fieldconfig.highlightpast && this.editDate && new moment() > new moment(this.model.data[this.fieldname])? true : false;
    }
}