/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ServiceComponentsModule
 */
import {Component, Input, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays the SLA Status as an indicator
 */
@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceticketslaindicator.html'
})
export class ServiceTicketSLAIndicator extends fieldGeneric {

    /**
     * represent the time lesft. This is calculated staticaly since the getter is costly on performance
     */
    private timeLeft: string = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

        // subscribe to the model changes and recalculate
        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                this.timeLeft = this._timeLeft;
            })
        );
    }

    /**
     * returns the name of the SLA Date filed from teh config
     */
    get sladatefield() {
        return this.fieldconfig.sladate ? this.fieldconfig.sladate : 'resolve_until';
    }

    /**
     *  returns the name of the prolong date field from the config
     */
    get prolongdatefield() {
        return this.fieldconfig.prolongdate ? this.fieldconfig.prolongdate : 'prolonged_until';
    }

    /**
     * returns the date to be used as SLA Date
     */
    get sladate() {
        let prolongDate = this.model.getField(this.prolongdatefield);
        return prolongDate && prolongDate.isValid && prolongDate.isValid() ? prolongDate : this.model.getField(this.sladatefield);
    }


    /**
     * returns the name of the reolve date fields
     */
    get resolvedatefield() {
        return this.fieldconfig.resolvedate ? this.fieldconfig.resolvedate : 'resolve_date';
    }

    /**
     * a timespan when the warining is issues
     */
    get warningtimespan() {
        return this.fieldconfig.warningtimespan ? this.fieldconfig.warningtimespan : '24';
    }

    /**
     * check if the ticket has an SLA
     */
    get hasSLA() {
        return this.model.getField(this.sladatefield) ? true : false;
    }

    /**
     * returns the time left
     *
     * @private
     */
    get _timeLeft() {
        let duration = moment.duration();
        let resdate = this.model.getField(this.resolvedatefield);
        if (resdate && resdate.isValid && resdate.isValid()) {
            let sladate = this.sladate;
            if (sladate && sladate.isAfter && sladate.isAfter(resdate)) {
                duration = moment.duration(sladate.diff(resdate));
            } else {
                duration = moment.duration(resdate.diff(sladate));
            }
            return duration.days() + 'd' + duration.hours() + 'h' + duration.minutes() + 'm';
        } else {
            let curdate = new moment();
            let sladate = this.sladate;
            if (sladate && sladate.isAfter && sladate.isAfter(curdate)) {
                duration = moment.duration(sladate.diff(curdate));
            } else {
                duration = moment.duration(curdate.diff(sladate));
            }
            return duration.days() + 'd' + duration.hours() + 'h' + duration.minutes() + 'm';
        }
        // return duration.as('minutes');
    }

    /**
     * returns the status of the SLA
     */
    get status() {
        let dateentered = this.model.getField('date_entered');
        let sladate = new moment(this.sladate);
        let resdate = new moment(this.model.getField(this.resolvedatefield));

        if (resdate && resdate.isValid && resdate.isValid()) {
            if (sladate.isBefore(resdate)) {
                return 'expired';
            }
        } else {
            let curdate = new moment();

            if (sladate.isBefore(curdate)) {
                return 'expired';
            }

            let duration = moment.duration(sladate.diff(curdate));
            if (duration.as('hours') < 24) {
                return 'warning';
            }
        }
        return '';
    }

    /**
     * returns the percentage based on the teime availabel and the time pased. This is used to present the ring properly
     */
    get percentage() {
        let resdate = this.model.getField(this.resolvedatefield);
        if (resdate && resdate.isValid && resdate.isValid()) {
            return 100;
        }

        let curdate = new moment();
        let dateentered = new moment(this.model.getField('date_entered'));
        let sladate = new moment(this.sladate);

        if (sladate.isBefore(curdate)) {
            return 0;
        }

        let totaltime = moment.duration(sladate.diff(dateentered));
        let timeleft = moment.duration(sladate.diff(curdate));

        let percentage = Math.round(timeleft.as('minutes') / totaltime.as('minutes') * 100);
        return percentage > 99 ? 99 : percentage;

    }

}
