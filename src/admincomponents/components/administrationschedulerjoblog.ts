import {Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from "../../services/model.service";
import {backend} from "../../services/backend.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {broadcast} from "../../services/broadcast.service";
import {userpreferences} from "../../services/userpreferences.service";

declare var _;
declare var moment;

@Component({
    selector: 'administration-scheduler-jobs-enum',
    templateUrl: './src/admincomponents/templates/administrationschedulerjoblog.html',
    providers: [relatedmodels]
})
export class AdministrationSchedulerJobLog implements OnDestroy{
    @ViewChild('logcontainer', {read: ViewContainerRef}) private logContainer: ViewContainerRef;
    public schedulerLogs: any[] = [];
    private expanded: boolean = true;
    private subscriber: any;

    constructor(public model: model,
                public language: language,
                public metadata: metadata,
                public broadcast: broadcast,
                public userpreferences: userpreferences,
                public backend: backend) {
        this.subscriber = this.broadcast.message$.subscribe(res => {
            if (res.messagetype == 'scheduler.run') {
                this.getData();
            }
        });
    }

    ngOnInit() {
        this.getData();
    }

    get logContainerStyle() {
        return {'max-height': `calc(100vh - ${this.logContainer.element.nativeElement.offsetTop}px`};
    }

    private getResolutionClass(status) {
        switch (status) {
            case 'failure':
                return 'slds-text-color_error';
            case 'success':
                return 'slds-text-color_success';
            default:
                return 'slds-text-color--default';
        }
    }

    public getData() {
        this.backend.getRequest("module/Schedulers/" + this.model.id + "/related/schedulers_times", {limit: -1}).subscribe(
            (response: any) => {
                this.schedulerLogs = _.values(response);
                this.schedulerLogs.sort((a, b) => {
                    if (a.execute_time > b.execute_time) {
                        return -1;
                    }
                    return 0;
                });
            }
        );
    }

    private displayDateValue(date) {
        if (!date) {return ''}
        date = moment(date).tz(moment.tz.guess());
        date.add(date.utcOffset(), "m");
        return date.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
    }

    public ngOnDestroy() {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
        }
    }
}