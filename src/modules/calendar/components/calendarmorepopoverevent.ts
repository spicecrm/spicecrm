/**
 * @module ModuleCalendar
 */
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from "../../../services/view.service";
import {session} from '../../../services/session.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'calendar-more-popover-event',
    templateUrl: './src/modules/calendar/templates/calendarmorepopoverevent.html',
    providers: [view, model]

})

export class CalendarMorePopoverEvent implements OnInit, OnDestroy {

    @ViewChild('calendarcontent', {read: ViewContainerRef}) calendarcontent: ViewContainerRef;
    @Input() public event: any = {};
    @Output() public action$: EventEmitter<any> = new EventEmitter<any>();
    private modeSubscriber: Subscription = new Subscription();

    constructor(private model: model, private session: session, private userpreferences: userpreferences, private router: Router) {
        this.modeSubscriber = this.model.mode$.subscribe(mode => this.action$.emit(mode));
    }

    public ngOnInit() {
        this.model.module = this.event.module;
        this.model.id = this.event.id;
        this.model.data = this.event.data;
    }

    public ngOnDestroy() {
        this.modeSubscriber.unsubscribe();
    }

    private goDetails(id, module) {
        this.router.navigate([`/module/${module}/${id}`]);
        this.action$.emit(true);
    }

    private canEdit(id) {
        return this.session.authData.userId == id;
    }

    private getStartHour(event) {
        return event.data.date_start ? moment(event.data.date_start).tz(moment.tz.guess())
            .add(moment().utcOffset(), 'm').format(this.userpreferences.getTimeFormat()) : "00:00";
    }
}