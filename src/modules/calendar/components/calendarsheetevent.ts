/**
 * @module ModuleCalendar
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
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
import {broadcast} from '../../../services/broadcast.service';
import {Subscription} from "rxjs";
import {configurationService} from "../../../services/configuration.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {metadata} from "../../../services/metadata.service";
import {CdkDragEnd} from "@angular/cdk/drag-drop";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'calendar-sheet-event',
    templateUrl: './src/modules/calendar/templates/calendarsheetevent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [model, view]
})
export class CalendarSheetEvent implements OnInit, OnDestroy {
    /**
     * @output rearrange: EventEmitter<void>
     */
    @Output() public rearrange: EventEmitter<any> = new EventEmitter<any>();
    /**
     * @output eventDrop: EventEmitter<cdkDragEnded>
     */
    @Output() public eventDrop: EventEmitter<any> = new EventEmitter<any>();
    public fields: any[] = [];
    /**
     * @input event: object
     */
    @Input() public event: any = {};

    private mouseMoveListener: any;
    private mouseUpListener: any;
    private previewsPageY: any;
    private currentPageY: any;
    private lastMoveTimeSpan: number = 0;
    private color: string = '';
    private hasDarkColor: boolean = true;
    private headerFieldset: string;
    private subFieldset: string;
    private subscriptions: Subscription = new Subscription();

    constructor(private language: language,
                private configuration: configurationService,
                private calendar: calendar,
                private model: model,
                private view: view,
                private broadcast: broadcast,
                private cdr: ChangeDetectorRef,
                private userpreferences: userpreferences,
                private metadata: metadata,
                private elementRef: ElementRef,
                private renderer: Renderer2) {
        this.subscribeToColorChange();
        this.subscribeToModelSave();
        // hide view labels
        this.view.displayLabels = false;
    }

    /**
     * @return startHour: string | undefined
     */
    get startHour() {
        return this.model.data.date_start ? moment(this.model.data.date_start)
            .tz(this.calendar.timeZone)
            .format(this.userpreferences.getTimeFormat()) : undefined;
    }

    /**
     * @return class: string
     */
    get textClass() {
        return this.calendar.sheetType != 'Schedule' && this.hasDarkColor ? 'spice-calendar-event-has-dark-color' : '';
    }

    /**
     * @return isAbsence: boolean
     */
    get isAbsence() {
        return this.event.type == 'absence' || this.event.module == 'UserAbsences';
    }

    /**
     * @return isDraggable: boolean
     */
    get isDraggable() {
        return this.canEdit && !this.event.isMulti && this.calendar.sheetType != 'Month';
    }

    /**
     * @return canEdit: boolean
     */
    get canEdit() {
        return (this.model.data.acl && this.model.checkAccess('edit')) && this.calendar.sheetType != 'Schedule' &&
            (this.event.type == 'event' || this.event.type == 'absence') && !this.calendar.asPicker && !this.calendar.isMobileView && !this.calendar.isDashlet;
    }

    /**
     * @return owner: string = assigned_user_id
     */
    get owner() {
        return this.calendar.owner;
    }

    /**
     * @return lockAxis: 'y' : undefined
     */
    get lockAxis() {
        return this.calendar.sheetType == 'Day' ? 'y' : undefined;
    }

    /**
     * @call setModelDataFromEvent
     * @call loadFieldset
     * @call setEventColor
     */
    public ngOnInit() {
        this.setModelDataFromEvent();
        this.loadFieldset();
        this.setEventColor();
    }

    /**
     * @unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * @call ChangeDetectorRef.detectChanges
     */
    private onClick() {
        this.cdr.detectChanges();
    }

    /**
     * @call ChangeDetectorRef.detectChanges
     */
    private onDragStart() {
        this.elementRef.nativeElement.style.zIndex = 9999;
    }

    /**
     * @notice this method will be called from the calendar service when its dropTarget param is defined
     * @param dropTarget: {day: moment, hour: number, minutes: number}
     * @set event.date_start
     * @set event.date_end
     * @set model.data
     * @call model.save
     */
    public onDrop(dropTarget) {

        if (dropTarget.day) {
            this.event.start = moment(dropTarget.day.date);
        }

        // set the start date
        this.event.start.hour(dropTarget.hour).minute(dropTarget.minutes).seconds(0);

        // calculate the end date
        this.event.end = moment(this.event.start.format()).add(this.event.data.duration_minutes + 60 * this.event.data.duration_hours, 'm');

        let module = this.calendar.modules.find(module => module.name == this.event.module) || {};
        let dateStartName = module.dateStartName || 'date_start';
        let dateEndName = module.dateEndName || 'date_end';
        this.event.data[dateStartName] = moment(this.event.start.format());
        this.event.data[dateEndName] = new moment(this.event.end.format());
        this.model.data = {...this.event.data};
        this.model.save(false);
    }

    /**
     * @param color: string
     * @return isDarkColor: boolean
     */
    protected isDarkColor(color) {
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

    /**
     * @param event: CdkDragEnd
     * @emit event by eventDrop
     */
    protected emitDrop(event: CdkDragEnd) {
        this.elementRef.nativeElement.style.zIndex = 'initial';
        this.eventDrop.emit(event);
    }

    /**
     * @set headerFieldset
     * @set subFieldset
     */
    private loadFieldset() {
        let config = this.metadata.getComponentConfig('CalendarSheetEvent', this.model.module);
        if (config && config.header_fieldset) this.headerFieldset = config.header_fieldset;
        if (config && config.sub_fieldset) this.subFieldset = config.sub_fieldset;
    }

    /**
     * @set otherColor
     */
    private subscribeToColorChange() {
        this.subscriptions.add(this.calendar.otherCalendarsColor$.subscribe(res => {
            if (this.event.data.assigned_user_id && res.id == this.event.data.assigned_user_id) {
                this.event.otherColor = res.color;
                this.cdr.detectChanges();
            }
        }));
    }

    /**
     * @set model.data
     * @call setEventColor
     */
    private subscribeToModelSave() {
        this.subscriptions.add(this.broadcast.message$.subscribe(message => {
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
                        this.cdr.detectChanges();
                        break;
                }
            }
        }));
    }

    /**
     * @set model.module
     * @set model.id
     * @set model.data
     */
    private setModelDataFromEvent() {
        this.model.module = this.event.module;
        this.model.id = this.event.data.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.event.data);
    }

    /**
     * @set previewsPageY
     * @set currentPageY
     * @set event.resizing
     * @set mouseUpListener
     * @set mouseMoveListener
     * @call stopPropagation
     * @call preventDefault
     * @set event.cancelBubble
     * @reset event.returnValue
     */
    private onMouseDown(event) {
        if (!this.canEdit) return;
        this.cdr.detach();
        this.previewsPageY = event.pageY;
        this.currentPageY = event.pageY;
        this.event.resizing = true;

        this.mouseUpListener = this.renderer.listen('document', 'mouseup', () => this.onMouseUp());
        this.mouseMoveListener = this.renderer.listen('document', 'mousemove', (event) => this.onMouseMove(event));

        // prevent triggering other events
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.cancelBubble = true;
        event.returnValue = false;
    }

    /**
     * handle the event end hour changes on mouse move
     * @param mouseEvent
     * @set currentPageY
     * @set lastMoveTimeSpan
     * @set event.end
     */
    private onMouseMove(mouseEvent) {
        this.currentPageY = mouseEvent.pageY;
        const moved = (this.currentPageY - this.previewsPageY);
        const span = Math.floor(moved / 15);
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

    /**
     * save the event end hour changes on mouse up
     * @reset mouseUpListener
     * @reset mouseMoveListener
     * @set duration_hours
     * @set duration_minutes
     * @set event.saving
     * @call model.save
     * @emit void by rearrange
     * @reset previewsPageY
     * @reset currentPageY
     * @reset resizing
     * @reset lastMoveTimeSpan
     */
    private onMouseUp() {
        this.cdr.reattach();
        this.mouseUpListener();
        this.mouseMoveListener();

        if (this.currentPageY != this.previewsPageY) {
            let durationMinutes = +this.event.data.duration_hours * 60 + +this.event.data.duration_minutes + this.lastMoveTimeSpan * 15;
            this.event.data.duration_hours = Math.floor(durationMinutes / 60);
            this.event.data.duration_minutes = durationMinutes - this.event.data.duration_hours * 60;
            this.model.data.duration_minutes = this.event.data.duration_minutes;
            this.model.data.duration_hours = this.event.data.duration_hours;

            // save the event
            this.event.saving = true;
            this.model.save()
                .subscribe(() => {
                    this.event.saving = false;
                    this.cdr.detectChanges();
                });

            // emit to rearrange on the sheet
            this.rearrange.emit();
        }
        this.previewsPageY = undefined;
        this.currentPageY = undefined;
        this.event.resizing = false;
        this.lastMoveTimeSpan = 0;
    }

    /**
     * set the default event color if it's not set
     * or set the hex color if it's defined in the color conditions table
     * @set hasDarkColor
     * @set color
     * @return void
     */
    private setEventColor() {
        if (this.calendar.sheetType == 'Schedule') return this.color = 'transparent';

        this.color = this.event.hasOwnProperty('color') ? this.event.color : this.calendar.eventColor;

        let colorConditions = this.configuration.getData('calendarcolorconditions');
        if (!colorConditions) return;

        // filter and sort the conditions
        colorConditions = colorConditions
            .filter(item => item.module == this.model.module)
            .sort((a, b) => +a.priority < +b.priority ? 1 : -1);
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
}
