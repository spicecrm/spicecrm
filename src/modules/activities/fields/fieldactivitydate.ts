/**
 * @module ModuleActivities
 */
import {Component, ElementRef, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {modal} from '../../../services/modal.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {userpreferences} from "../../../services/userpreferences.service";

declare var moment;

/**
 * renders a date formatted based on the past period like. If today will display only the hour, if this year will
 * display the month name and the day, and if it is a date in a different year then it displays a full date.
 */
@Component({
    selector: 'field-activity-date',
    templateUrl: '../templates/fieldactivitydate.html'
})
export class fieldActivityDate extends fieldGeneric {
    /**
     * holds a cached object of the date value in raw and formatted
     */
    public cachedValue: { raw: string, formatted?: string };

    constructor(public model: model,
                public view: view,
                public broadcast: broadcast,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public modal: modal,
                public userpreferences: userpreferences) {

        super(model, view, language, metadata, router);
        this.subscribeToDataChange();
    }

    /**
     * call the init method on parent and call to set the formatted value
     */
    public ngOnInit() {
        super.ngOnInit();
        this.setFormattedValue();
    }

    /**
     * subscribe to data changes to reset the formatted value
     * @private
     */
    public subscribeToDataChange() {
        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                if (!data[this.fieldname] || moment(this.cachedValue?.raw).isSame(data[this.fieldname])) return;
                this.setFormattedValue();
            })
        );
    }

    /**
     * set the local formatted value
     * @private
     */
    public setFormattedValue() {

        if (!this.value) return;

        this.cachedValue = {raw: this.value};
        const date = new moment(this.value);

        const isToday = moment(date.format('YYYY M D')).isSame(new moment().format('YYYY M D'));
        const isThisYear = date.isSame(new moment(), 'year');

        if (isToday) {
            this.cachedValue.formatted = date.format(this.userpreferences.getTimeFormat());
        } else if (isThisYear) {
            this.cachedValue.formatted = date.format('MMM D');
        } else {
            this.cachedValue.formatted = date.format(this.userpreferences.getDateFormat());
        }
    }
}
