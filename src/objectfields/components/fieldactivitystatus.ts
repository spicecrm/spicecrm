import {Component, OnDestroy, OnInit} from '@angular/core';
import {fieldEnum} from "./fieldenum";
import {Router} from "@angular/router";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {Subscription} from "rxjs";
import {session} from "../../services/session.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'field-activity-status',
    templateUrl: '../templates/fieldactivitystatus.html'
})

export class fieldActivityStatus extends fieldEnum implements OnInit, OnDestroy {

    /**
     * holds any subscription a field might have
     */
    public subscriptions: Subscription = new Subscription();

    public timeZone: any;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public session: session) {
        super(model, view, language, metadata, router);
    }

    ngOnInit() {
        this.getOptions();
        this.timeZone = this.session.getSessionData('timezone', false);
        this.subscribeToChanges();
    }

    public subscribeToChanges() {
        this.subscriptions.add(
            this.model.observeFieldChanges('date_start').subscribe({
                next: (value) => {
                    this.calculateDate();
                }
            })
        );
    }

    /**
     * loads the options for the general translated display odf the current status
     */
    public getOptions() {
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.model.module, this.fieldname);
        for (let optionVal in options) {
            retArray.push({
                value: optionVal,
                display: options[optionVal]
            });
        }
        this.options = retArray;
    }

    /**
     * checks whether the start date is before or after now
     * sets the value for status field accordingly
     */
    public calculateDate() {

        // retrieve value from the field$ observable, this.model.data.date_start is not yet updated at this point
        const startDate = moment(this.model.field$.value.value).format('YYYY-MM-DD HH:MM a');

        let now = new moment.tz(this.timeZone || moment.tz.guess(true)).format('YYYY-MM-DD HH:MM a');

        if (startDate <= now) {
            this.model.setField(this.fieldname, 'Held');
        } else {
            this.model.setField(this.fieldname, 'Planned');
        }
    }

    /**
     * unsubscribe from all subscriptions
     */
    public ngOnDestroy() {
        super.ngOnDestroy();
        this.subscriptions.unsubscribe();
    }
}