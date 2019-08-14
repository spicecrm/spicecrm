/**
 * @module ServiceComponentsModule
 */
import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from "@angular/router";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceticketslaindicator.html'
})
export class ServiceTicketSLAIndicator extends fieldGeneric {

    @Input() public fieldconfig: any = {};
    public disabled: boolean = true;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get sladatefield() {
        return this.fieldconfig.sladate ? this.fieldconfig.sladate : 'resolve_until';
    }

    get prolongdatefield() {
        return this.fieldconfig.prolongdate ? this.fieldconfig.prolongdate : 'prolonged_until';
    }

    get sladate() {
        let prolongDate = this.model.getField(this.prolongdatefield);
        return prolongDate && prolongDate.isValid && prolongDate.isValid() ? prolongDate : this.model.getField(this.sladatefield);
    }

    get resolvedatefield() {
        return this.fieldconfig.resolvedate ? this.fieldconfig.resolvedate : 'resolve_date';
    }

    get warningtimespan() {
        return this.fieldconfig.warningtimespan ? this.fieldconfig.warningtimespan : '24';
    }

    get hasSLA() {
        return this.model.getField(this.sladatefield) ? true : false;
    }

    get timeLeft() {
        let duration = moment.duration();
        let resdate = this.model.getField(this.resolvedatefield);
        if (resdate && resdate.isValid && resdate.isValid()) {
            let sladate = this.sladate;
            if (sladate.isAfter(resdate)) {
                duration = moment.duration(sladate.diff(resdate));
            } else {
                duration = moment.duration(resdate.diff(sladate));
            }
            return duration.days() + 'd' + duration.hours() + 'h' + duration.minutes() + 'm';
        } else {
            let curdate = new moment();
            let sladate = this.sladate;
            if (sladate.isAfter(curdate)) {
                duration = moment.duration(sladate.diff(curdate));
            } else {
                duration = moment.duration(curdate.diff(sladate));
            }
            return duration.days() + 'd' + duration.hours() + 'h' + duration.minutes() + 'm';
        }
        // return duration.as('minutes');
    }

    get status() {
        let dateentered = this.model.getField('date_entered');
        let sladate = this.sladate;
        let resdate = this.model.getField(this.resolvedatefield);

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

    get percentage() {
        let resdate = this.model.getField(this.resolvedatefield);
        if (resdate && resdate.isValid && resdate.isValid()) {
            return 100;
        }

        let curdate = new moment();
        let dateentered = this.model.getField('date_entered');
        let sladate = this.sladate;

        if (sladate.isBefore(curdate)) {
            return 0;
        }

        let totaltime = moment.duration(sladate.diff(dateentered));
        let timeleft = moment.duration(sladate.diff(curdate));

        let percentage = Math.round(timeleft.as('minutes') / totaltime.as('minutes') * 100);
        return percentage > 99 ? 99 : percentage;

    }

}
