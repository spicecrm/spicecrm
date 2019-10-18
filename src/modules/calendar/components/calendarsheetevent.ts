/**
 * @module ModuleCalendar
 */
import {
    Component,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {calendar} from '../services/calendar.service';
import {Subscription} from "rxjs";
import {configurationService} from "../../../services/configuration.service";
import {take} from "rxjs/operators";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'calendar-sheet-event',
    templateUrl: './src/modules/calendar/templates/calendarsheetevent.html',
    providers: [model, view]
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
    private subscription: Subscription = new Subscription();
    private lastMoveTimeSpan: number = 0;
    private color: string = '';
    private hasDarkColor: boolean = true;

    constructor(private language: language,
                private configuration: configurationService,
                private calendar: calendar,
                private model: model,
                private renderer: Renderer2) {
        this.subscription = this.calendar.color$.subscribe(res => {
            if (this.event.data.assigned_user_id && res.id == this.event.data.assigned_user_id) {
                this.color = res.color;
            }
        });
    }

    get isAbsense() {
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
        this.setEventColor();
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /*
    * set dragging item and hide the original item for z-index conflict purpose
    * @return void
    */
    private setModelDataFromEvent() {
        this.model.module = this.event.module;
        this.model.id = this.event.id;
        this.model.data = this.event.data;
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
        colorConditions.forEach(con => {
            if (con.module == this.model.module) {
                this.hasDarkColor = this.isDarkColor(con.color_hex_code);
                if (con.module_filter != null && con.module_filter.length > 0) {
                    if (this.model.checkModuleFilterMatch(con.module_filter)) {
                        this.color = con.color_hex_code.indexOf('#') > -1 ? con.color_hex_code : '#' + con.color_hex_code;
                    }
                } else {
                    this.color = con.color_hex_code.indexOf('#') > -1 ? con.color_hex_code : '#' + con.color_hex_code;
                }
            }
        });
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
            let dateEndName = module.dateEndName ||'date_end';
            this.event.data[dateStartName] = moment(this.event.start.format());
            this.event.data[dateEndName] = new moment(this.event.end.format());
            this.model.data = {...this.event.data};
            this.model.save(false);
        });
    }
}
