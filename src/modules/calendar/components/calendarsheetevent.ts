/**
 * @module ModuleCalendar
 */
import {
    Component,
    EventEmitter,
    HostBinding,
    HostListener,
    Input, OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {calendar} from '../services/calendar.service';
import {broadcast} from '../../../services/broadcast.service';
import {Subscription} from "rxjs";
import {configurationService} from "../../../services/configuration.service";
import {take} from "rxjs/operators";
import {userpreferences} from "../../../services/userpreferences.service";
import {metadata} from "../../../services/metadata.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'calendar-sheet-event',
    templateUrl: './src/modules/calendar/templates/calendarsheetevent.html',
    providers: [model, view],
    styles: [`
        .event_has_dark_color {
            color: #ffffff;
        }
        .event_has_dark_color:hover {
            color: #eeeeee;
        }
    `]
})
export class CalendarSheetEvent implements OnInit, OnDestroy {
    @Output() public rearrange: EventEmitter<any> = new EventEmitter<any>();
    public fields: any[] = [];
    @Input() public event: any = {};
    @Input("ismonthsheet") private isMonthSheet: boolean = false;
    @Input("isschedulesheet") private isScheduleSheet: boolean = false;
    private mouseMoveListener: any = undefined;
    private mouseUpListener: any = undefined;
    private mouseStart: any = undefined;
    private mouseLast: any = undefined;
    private hidden: boolean = false;
    private subscriptions: Subscription[] = [];
    private lastMoveTimeSpan: number = 0;
    private color: string = '';
    private hasDarkColor: boolean = true;
    private headerFieldset: string;
    private subFieldset: string;

    constructor(private language: language,
                private configuration: configurationService,
                private calendar: calendar,
                private model: model,
                private view: view,
                private broadcast: broadcast,
                private userpreferences: userpreferences,
                private metadata: metadata,
                private renderer: Renderer2) {
        this.subscriptions.push(this.calendar.color$.subscribe(res => {
            if (this.event.data.assigned_user_id && res.id == this.event.data.assigned_user_id) {
                this.color = res.color;
            }
        }));

        this.subscriptions.push(this.broadcast.message$.subscribe(message => {
            let id = message.messagedata.id;
            let module = message.messagedata.module;
            let data = message.messagedata.data;
            if (module == this.model.module) {
                switch (message.messagetype) {
                    case "model.save":
                        if (id == this.model.id) {
                            this.model.data = this.model.utils.backendModel2spice(this.model.module, data);
                            this.setEventColor();
                        }
                        break;
                }
            }
        }));

        // set the view to nbot diusplay labels
        this.view.displayLabels = false;
    }

    get startHour() {
        return this.model.data.date_start ? moment(this.model.data.date_start).tz(this.calendar.timeZone).format(this.userpreferences.getTimeFormat()) : undefined;
    }

    get textClass() {
        return !this.isScheduleSheet && this.hasDarkColor ? 'event_has_dark_color' : '';
    }

    get isAbsence() {
        return this.event.type == 'absence' || this.event.module == 'UserAbsences';
    }

    get isDraggable() {
        return this.canEdit && !this.event.isMulti && !this.isMonthSheet;
    }

    @HostBinding('class')
    get eventClass() {
        return 'slds-is-absolute slds-p-bottom--xxx-small' + (this.hidden ? ' slds-hidden' : '');
    }


    get canEdit() {
        return this.owner == this.event.data.assigned_user_id && !this.isScheduleSheet &&
            (this.event.type == 'event' || this.event.type == 'absence') && !this.calendar.asPicker && !this.calendar.isMobileView && !this.calendar.isDashlet;
    }

    get owner() {
        return this.calendar.owner;
    }

    get eventStyle() {
        return {
            'height': '100%',
            'border-radius': '2px',
            'background-color': !this.isScheduleSheet ? this.color : 'transparent',
        };
    }

    public ngOnInit() {
        this.setModelDataFromEvent();
        let config = this.metadata.getComponentConfig('CalendarSheetEvent', this.model.module);
        if (config && config.header_fieldset) this.headerFieldset = config.header_fieldset;
        if (config && config.sub_fieldset) this.subFieldset = config.sub_fieldset;
        this.setEventColor();
    }

    public ngOnDestroy() {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    /*
    * set dragging item and hide the original item for z-index conflict purpose
    * @return void
    */
    private setModelDataFromEvent() {
        this.model.module = this.event.module;
        this.model.id = this.event.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.event.data);
    }

    /*
    * set dragging item and hide the original item for z-index conflict purpose
    * @param drag event
    * @return void
    */
    @HostListener('dragstart', ['$event'])
    private dragStart(event) {
        if (!this.canEdit) return;
        event.dataTransfer.effectAllowed = 'move';
        this.subscribeToDrop();
        setTimeout(() => this.hidden = true);
        event.stopPropagation();
    }


    /*
    * show the original item
    * @return void
    */
    @HostListener('dragend')
    private dragEnd() {
        this.hidden = false;
    }

    /*
    * listen to other mouse events
    * @param mouse event
    * @return void
    */
    private onMouseDown(e) {

        this.mouseStart = e;
        this.mouseLast = e;
        this.event.resizing = true;

        this.mouseUpListener = this.renderer.listen('document', 'mouseup', (event) => this.onMouseUp());
        this.mouseMoveListener = this.renderer.listen('document', 'mousemove', (event) => this.onMouseMove(event));

        // prevent triggering other events
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
    }

    /*
    * handle the event end hour changes on mouse move
    * @param mouse event
    * @return void
    */
    private onMouseMove(e) {
        if (!this.canEdit) {
            return;
        }
        this.mouseLast = e;
        let moved = (this.mouseLast.pageY - this.mouseStart.pageY);
        let span = Math.floor(moved / 15);
        if (this.lastMoveTimeSpan !== span) {
            this.lastMoveTimeSpan = span;
            let eventEnd = new moment(this.event.start).add((this.event.data.duration_hours * 60) + this.event.data.duration_minutes + (this.lastMoveTimeSpan * 15), 'm');
            if (this.event.start.hours() === eventEnd.hours() && this.event.start.minutes() === eventEnd.minutes() || eventEnd.hours() < this.event.start.hours()) {
                this.event.end = new moment(this.event.start).add(15, 'm');
                this.lastMoveTimeSpan = this.lastMoveTimeSpan - (((this.event.data.duration_hours * 60) + this.event.data.duration_minutes + (this.lastMoveTimeSpan * 15)) / 15) + 1;
            } else {
                this.event.end = eventEnd;
            }
        }

    }

    /*
    * save the event end hour changes on mouse up
    * @return void
    */
    private onMouseUp() {
        this.mouseUpListener();
        this.mouseMoveListener();

        if (!this.canEdit) {
            return;
        }

        if (this.mouseLast.pageY != this.mouseStart.pageY) {
            let durationMinutes = +this.event.data.duration_hours * 60 + +this.event.data.duration_minutes + this.lastMoveTimeSpan * 15;
            this.event.data.duration_hours = Math.floor(durationMinutes / 60);
            this.event.data.duration_minutes = durationMinutes - this.event.data.duration_hours * 60;
            this.model.data.duration_minutes = this.event.data.duration_minutes;
            this.model.data.duration_hours = this.event.data.duration_hours;

            // save the event
            this.event.saving = true;
            this.model.save()
                .subscribe(data => {
                    this.event.saving = false;
                });

            // emit to rearrange on the sheet
            this.rearrange.emit();
        }
        this.mouseStart = undefined;
        this.mouseLast = undefined;
        this.event.resizing = false;
        this.lastMoveTimeSpan = 0;
    }

    /*
    * set the default event color if it's not set
    * or set the hex color if it's defined in the color conditions table
    * @return void
    */
    private setEventColor() {
        this.color = this.event.hasOwnProperty('color') ? this.event.color : this.calendar.eventColor;

        let colorConditions = this.configuration.getData('calendarcolorconditions');
        if (!colorConditions || this.owner != this.event.data.assigned_user_id) return;

        // filter and sort the conditions
        colorConditions = colorConditions.filter(item => item.module == this.model.module).sort((a, b) => {
            a.priority < b.priority ? 1 : -1;
        });
        for (let colorCondition of colorConditions) {
            if (colorCondition.module_filter != null && colorCondition.module_filter.length > 0) {
                if (this.model.checkModuleFilterMatch(colorCondition.module_filter)) {
                    this.color = colorCondition.color_hex_code.indexOf('#') > -1 ? colorCondition.color_hex_code : '#' + colorCondition.color_hex_code;
                    this.hasDarkColor = this.isDarkColor(colorCondition.color_hex_code);
                    break;
                }
            } else {
                this.color = colorCondition.color_hex_code.indexOf('#') > -1 ? colorCondition.color_hex_code : '#' + colorCondition.color_hex_code;
                this.hasDarkColor = this.isDarkColor(colorCondition.color_hex_code);
                break;
            }
        }
    }

    /*
    * @param color
    * @return boolean
    */
    private isDarkColor(color) {
        let c = color.indexOf('#') > -1 ? color.substring(1) : color;
        let rgb = parseInt(c, 16);   // convert rrggbb to decimal
        // tslint:disable-next-line:no-bitwise
        let r = (rgb >> 16) & 0xff;  // extract red
        // tslint:disable-next-line:no-bitwise
        let g = (rgb >> 8) & 0xff;  // extract green
        // tslint:disable-next-line:no-bitwise
        let b = (rgb >> 0) & 0xff;  // extract blue
        let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        return luma < 120;
    }

    private subscribeToDrop() {
        this.calendar.eventDrop$
            .pipe(take(1))
            .subscribe(dropData => {
                if (dropData.day) {
                    this.event.start = moment(dropData.day.date.format());
                }
                this.event.start.hour(dropData.hour).minute(dropData.minutes).seconds(0);

                // calculate the end date
                this.event.end = moment(this.event.start.format()).add(this.event.data.duration_minutes + 60 * this.event.data.duration_hours, 'm');

                let module = this.calendar.modules.find(module => module.name == this.event.module) || {};
                let dateStartName = module.dateStartName || 'date_start';
                let dateEndName = module.dateEndName || 'date_end';
                this.event.data[dateStartName] = moment(this.event.start.format());
                this.event.data[dateEndName] = new moment(this.event.end.format());
                this.model.data = {...this.event.data};
                this.model.save(false);
            });
    }

}
