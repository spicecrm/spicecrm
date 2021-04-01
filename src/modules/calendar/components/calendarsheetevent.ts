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
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
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

/**
 * Display a calendar event with drag/drop and resize handling
 */
@Component({
    selector: 'calendar-sheet-event',
    templateUrl: './src/modules/calendar/templates/calendarsheetevent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [model, view]
})
export class CalendarSheetEvent implements OnInit, OnDestroy {
    /**
     * emit to handle event changes
     */
    @Output() private eventChange = new EventEmitter<void>();
    /**
     * emit the event drop to be handled
     */
    @Output() private eventDrop = new EventEmitter<any>();
    /**
     * @input event: object
     */
    @Input() private event: any = {};
    /**
     * @input event: object
     */
    @Input() private sheetContainer: any = {};
    /**
     * holds the mouse up listener to be removed
     */
    private mouseUpListener: any;
    /**
     * holds the previews page y
     */
    private previewsPageY: any;
    /**
     * holds the current page y
     */
    private currentPageY: any;
    /**
     * holds the last move time span
     */
    private oldDuration: number = 0;
    /**
     * holds the event background color
     */
    private color: string = '';
    /**
     * holds the dark color boolean
     */
    private hasDarkColor: boolean = true;
    /**
     * a fieldset id for loading a header fieldset in the event
     */
    private headerFieldset: string;
    /**
     * a fieldset id for loading a body fieldset in the event
     */
    private subFieldset: string;
    /**
     * subscription to be unsubscribed on destroy
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private language: language,
                private configuration: configurationService,
                private calendar: calendar,
                private model: model,
                private view: view,
                private broadcast: broadcast,
                private cdRef: ChangeDetectorRef,
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
    get startHour(): string {
        return this.model.data.date_start ? moment(this.model.data.date_start)
            .tz(this.calendar.timeZone)
            .format(this.userpreferences.getTimeFormat()) : undefined;
    }

    /**
     * @return class: string
     */
    get textClass(): string {
        return this.calendar.sheetType != 'Schedule' && this.hasDarkColor ? 'spice-calendar-event-has-dark-color' : '';
    }

    /**
     * @return isAbsence: boolean
     */
    get isAbsence(): boolean {
        return this.event.type == 'absence' || this.event.module == 'UserAbsences';
    }

    /**
     * @return isDraggable: boolean
     */
    get isDraggable(): boolean {
        return this.canEdit && !this.event.isMulti && this.calendar.sheetType != 'Month';
    }

    /**
     * @return canEdit: boolean
     */
    get canEdit(): boolean {
        return (this.model.data.acl && this.model.checkAccess('edit')) && this.calendar.sheetType != 'Schedule' &&
            (this.event.type == 'event' || this.event.type == 'absence') && !this.calendar.asPicker && !this.calendar.isMobileView && !this.calendar.isDashlet;
    }

    /**
     * @return owner: string = assigned_user_id
     */
    get owner(): string {
        return this.calendar.owner;
    }

    /**
     * @return lockAxis: 'y' : undefined
     */
    get lockAxis(): any {
        return this.calendar.sheetType == 'Day' ? 'y' : undefined;
    }

    /**
     * call the initial event methods
     */
    public ngOnInit() {
        this.setModelDataFromEvent();
        this.loadFieldset();
        this.setEventColor();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * set the event date from the drop position
     * @notice this method will be called from the calendar service
     * @param dropTarget
     */
    public onDrop(dropTarget) {

        const durationMinutes = this.event.end.diff(this.event.start, 'minutes');

        if (dropTarget.day) {
            this.event.start = moment(dropTarget.day.date);
        }

        // set the start date
        this.event.start.hour(dropTarget.hour).minute(dropTarget.minutes).seconds(0);

        // calculate the end date
        this.event.end = moment(this.event.start).add(durationMinutes, 'minutes');
        this.event.data.duration_hours = Math.floor(durationMinutes / 60);
        this.event.data.duration_minutes = durationMinutes - (this.event.data.duration_hours * 60);

        const module = this.calendar.modules.find(module => module.name == this.event.module) || {};
        const dateStartName = module.dateStartFieldName || 'date_start';
        const dateEndName = module.dateEndFieldName || 'date_end';

        this.event.data[dateStartName] = moment(this.event.start.format());
        this.event.data[dateEndName] = moment(this.event.end.format());

        this.model.startEdit(true, true);
        this.model.data = {...this.event.data};

        this.model.save(false);

        this.eventChange.emit();
    }

    /**
     * check the color darkness by rgb luma
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
     * emit the event drop and reset the z index
     */
    protected emitDrop(event: CdkDragEnd) {
        this.elementRef.nativeElement.style.zIndex = 'initial';
        this.eventDrop.emit(event);
    }

    /**
     * detect changes for the dropdown
     */
    private onClick() {
        this.cdRef.detectChanges();
    }

    /**
     * set a higher z index for the event
     */
    private onDragStart() {
        this.elementRef.nativeElement.style.zIndex = 9999;
    }

    /**
     * load event fieldsets
     */
    private loadFieldset() {
        let config = this.metadata.getComponentConfig('CalendarSheetEvent', this.model.module);
        if (config && config.header_fieldset) {
            this.headerFieldset = config.header_fieldset;
        }
        if (config && config.sub_fieldset) {
            this.subFieldset = config.sub_fieldset;
        }
    }

    /**
     * reset event color on color change
     */
    private subscribeToColorChange() {
        this.subscriptions.add(this.calendar.otherCalendarsColor$.subscribe(res => {
            if (this.event.data.assigned_user_id && res.id == this.event.data.assigned_user_id) {
                this.event.otherColor = res.color;
                this.cdRef.detectChanges();
            }
        }));
    }

    /**
     * reset data on model save
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
                            this.eventChange.emit();
                        }
                        break;
                }
            }
        }));
    }

    /**
     * set model data from event
     */
    private setModelDataFromEvent() {
        this.model.module = this.event.module;
        this.model.id = this.event.data.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.event.data);
    }

    /**
     * set mouse listeners and the necessary variables for the later calculation
     */
    private onMouseDown(event) {
        if (!this.canEdit) return;
        this.cdRef.detach();
        this.previewsPageY = event.pageY;
        this.currentPageY = event.pageY;
        this.oldDuration = this.event.end.diff(this.event.start, 'minutes');
        this.event.resizing = true;

        const mouseMoveListener = this.renderer.listen('document', 'mousemove', (event) => this.onMouseMove(event));
        this.mouseUpListener = this.renderer.listen('document', 'mouseup', () => this.onMouseUp(mouseMoveListener));

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
     */
    private onMouseMove(mouseEvent) {
        this.currentPageY = mouseEvent.pageY;
        const hourPart = (this.calendar.sheetHourHeight / 4);
        const isMoveForward = (this.currentPageY - this.previewsPageY) > hourPart;
        const isMoveBackward = (this.currentPageY - this.previewsPageY) < -Math.abs(hourPart);
        const durationAction = isMoveForward ? 'add' : isMoveBackward ? 'subtract' : null;

        if (durationAction) {
            this.previewsPageY = this.currentPageY;
            this.event.end[durationAction](15, 'minutes');
            this.eventChange.emit();
        }
    }

    /**
     * save the event end hour changes on mouse up
     */
    private onMouseUp(mouseMoveListener) {
        this.cdRef.reattach();
        this.mouseUpListener();
        mouseMoveListener();

        const durationMinutes = this.event.end.diff(this.event.start, 'minutes');

        if (this.oldDuration != durationMinutes) {
            this.event.data.duration_hours = Math.floor(durationMinutes / 60);
            this.event.data.duration_minutes = durationMinutes - (this.event.data.duration_hours * 60);

            this.model.startEdit(true, true);
            this.model.data.duration_minutes = this.event.data.duration_minutes;
            this.model.data.duration_hours = this.event.data.duration_hours;
            const module = this.calendar.modules.find(module => module.name == this.event.module) || {};
            const dateEndName = module.dateEndFieldName || 'date_end';
            this.model.data[dateEndName] = moment(this.event.end.format());

            // save the event
            this.event.saving = true;
            this.model.save().subscribe(() => {
                this.event.saving = false;
                this.cdRef.detectChanges();
            });
            this.eventChange.emit();
        }
        this.previewsPageY = undefined;
        this.currentPageY = undefined;
        this.event.resizing = false;
        this.oldDuration = 0;
    }

    /**
     * set the default event color if it's not set
     * or set the hex color if it's defined in the color conditions table
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
