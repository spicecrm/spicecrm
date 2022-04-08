/**
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {session} from '../../../services/session.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {broadcast} from "../../../services/broadcast.service";
import {Subscription} from "rxjs";

/** @ignore */
declare var moment: any;

/**
 * display formatted report record value with date time
 */
@Component({
    selector: 'reporter-field-date-time',
    templateUrl: '../templates/reporterfielddatetime.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldDateTime implements OnInit {
    /**
     * report full record
     */
    public record: any = {};
    /**
     * report field
     */
    public field: any = {};
    /**
     * display value
     */
    public value: string = '';
    /**
     * to save observable for unsubscribe
     */
    public subscription: Subscription = new Subscription();

    constructor(public userpreferences: userpreferences,
                public session: session,
                public cdRef: ChangeDetectorRef,
                public broadcast: broadcast) {
        this.subscribeToTimezoneChange();
    }

    /**
     * call to set the display value
     */
    public ngOnInit() {
        this.setFormattedFieldValue();
    }

    /**
     * unsubscribe from subscription
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * reset the field value on timezone change
     */
    public subscribeToTimezoneChange() {
        this.subscription.add(
            this.broadcast.message$.subscribe(message => {
                if (message.messagetype == 'timezone.changed') {
                    this.setFormattedFieldValue();
                    this.cdRef.detectChanges();
                }
            })
        );
    }

    /**
     * set formatted field value
     */
    public setFormattedFieldValue() {

        if (this.record[this.field.fieldid]) {
            let date = new moment.utc(this.record[this.field.fieldid]).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));
            if (date.isValid()) {
                this.value = this.userpreferences.formatDateTime(date);
            }
        }
    }
}
