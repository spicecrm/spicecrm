import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from "../../../services/view.service";
import {session} from '../../../services/session.service';
import {userpreferences} from '../../../services/userpreferences.service';

declare var moment: any;

@Component({
    selector: 'calendar-more-popover-event',
    templateUrl: './src/modules/calendar/templates/calendarmorepopoverevent.html',
    providers: [view, model]

})

export class CalendarMorePopoverEvent implements OnInit {

    @ViewChild('calendarcontent', {read: ViewContainerRef}) calendarcontent: ViewContainerRef;
    @Input() public event: any = {};
    @Output() public action$: EventEmitter<any> = new EventEmitter<any>();

    constructor(private model: model, private session: session, private userpreferences: userpreferences) {
        this.model.mode$.subscribe(mode => this.action$.emit(mode));
    }

    public ngOnInit() {
        this.model.module = this.event.module;
        this.model.id = this.event.id;
        this.model.data = this.event.data;
    }

    private canEdit(id) {
        return this.session.authData.userId == id;
    }

    private getStartHour(event) {
        return event.data.date_start ? moment(event.data.date_start).tz(moment.tz.guess())
            .add(moment().utcOffset(), 'm').format(this.userpreferences.getTimeFormat()) : "00:00";
    }
}