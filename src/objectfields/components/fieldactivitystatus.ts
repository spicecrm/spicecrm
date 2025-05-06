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
        this.calculateDate();
    }

    public subscribeToChanges() {
        this.subscriptions.add(this.model.observeFieldChanges('date_start').subscribe(({ value }) => this.calculateDate(value)));
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
     * @param newStart (optional) A raw ISO date string to use instead of the current model value
     */
    public calculateDate(newStart?: string) {
        const startRaw = newStart ?? this.model.getField('date_start');
        if (!startRaw || !moment(startRaw).isValid()) {
            return;
        }

        const tz = this.timeZone || moment.tz.guess();
        const start = moment.tz(startRaw, tz);
        const current = moment.tz(tz);

        const status = start.isSameOrBefore(current) ? 'Held' : 'Planned';
        this.model.setField(this.fieldname, status);
    }

    /**
     * unsubscribe from all subscriptions
     */
    public ngOnDestroy() {
        super.ngOnDestroy();
        this.subscriptions.unsubscribe();
    }
}