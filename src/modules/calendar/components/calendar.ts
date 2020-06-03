/**
 * @module ModuleCalendar
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, OnDestroy, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';
import {Subscription} from "rxjs";
import {CalendarHeader} from "./calendarheader";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {take} from "rxjs/operators";
import {metadata} from "../../../services/metadata.service";

/**
 * Main container which displays a monitor panel, a header with tools and the calendar selected sheet.
 */
@Component({
    selector: 'calendar',
    templateUrl: './src/modules/calendar/templates/calendar.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [calendar, model]
})

export class Calendar implements AfterViewInit, OnDestroy {
    public otherCalendars: any[] = [];
    public componentconfig: any = {};
    public googleIsVisible: boolean = true;
    @ViewChild('calendarcontainer', {read: ViewContainerRef, static: true}) private calendarContainer: ViewContainerRef;
    @ViewChild(CalendarHeader, {static: true}) private calendarHeader: CalendarHeader;
    private subscriptions: Subscription = new Subscription();
    private touchStartListener: any;
    private touchMoveListener: any;
    private resizeListener: any;
    private xDown: number = null;
    private yDown: number = null;
    private self: any = {};

    constructor(private language: language,
                private navigation: navigation,
                private elementRef: ElementRef,
                private renderer: Renderer2,
                private modal: modal,
                private cdr: ChangeDetectorRef,
                private model: model,
                private metadata: metadata,
                private injector: Injector,
                private calendar: calendar) {
        this.navigation.setActiveModule('Calendar');
        let addingEventSubscriber = this.calendar.addingEvent$.subscribe(res => this.addEvent(res));
        this.subscriptions.add(addingEventSubscriber);

        this.resizeListener = this.renderer.listen('window', 'resize', () => {
            this.calendar.isMobileView = this.calendarContainer.element.nativeElement.getBoundingClientRect().width < 768;
        });
        this.touchStartListener = this.renderer.listen('document', 'touchstart', e => this.handleTouchStart(e));
    }

    get pickerDualMode() {
        return this.componentconfig.pickerDualMode;
    }

    get isMobileView() {
        return this.calendar.isMobileView;
    }

    get sheetType() {
        return this.calendar.sheetType;
    }

    get sidebarWidth() {
        return this.calendar.sidebarWidth;
    }

    get weekStartDay() {
        return this.calendar.weekStartDay;
    }

    get calendarDate() {
        return this.calendar.calendarDate;
    }

    get asPicker() {
        return this.calendar.asPicker;
    }

    set asPicker(value) {
        if (value) {
            this.calendar.sheetType = 'Three_Days';
            this.calendar.asPicker = value;
        } else {
            this.closeModal();
        }
    }

    get sidebarStyle() {
        return {
            'width': this.calendar.sidebarwidth + 'px',
            'z-index': 1,
        };
    }

    get mainContainerClass() {
        return !this.asPicker ? 'slds-theme--default' : 'slds-modal slds-fade-in-open slds-modal_large';
    }

    get sheetStyle() {
        return {
            width: `calc(100% - ${this.sidebarWidth}px)`,
            height: '100%',
        };
    }

    public ngAfterViewInit() {
        this.calendar.isMobileView = this.calendarContainer.element.nativeElement.getBoundingClientRect().width < 768;
        this.cdr.detectChanges();

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();

        if (this.resizeListener) {
            this.resizeListener();
        }
        if (this.touchStartListener) {
            this.touchStartListener();
        }
    }

    private handleUntilDate(event) {
        this.calendarHeader.scheduleUntilDate = event;
    }

    private setDateChanged(event) {
        this.calendarHeader.toggleClosed();
        this.calendar.refresh(event);
    }

    private handleGoogleIsVisible(value) {
        this.googleIsVisible = value;
    }

    private closeModal() {
        this.self.destroy();
    }

    private handleTouchStart(evt) {
        const touches = evt.touches || evt.originalEvent.touches;
        this.xDown = touches[0].clientX;
        this.yDown = touches[0].clientY;
        this.touchMoveListener = this.renderer.listen('document', 'touchmove', e => this.handleTouchMove(e));
    }

    private handleTouchMove(evt) {
        this.touchMoveListener();

        if (!this.xDown || !this.yDown) {
            return;
        }
        let xDiff = this.xDown - evt.touches[0].clientX;

        if (Math.abs(xDiff) > Math.abs(this.yDown - evt.touches[0].clientY)) {
            if (xDiff < 0) {
                this.calendar.shiftMinus();
            } else {
                this.calendar.shiftPlus();
            }
        }
        this.xDown = null;
        this.yDown = null;
    }

    private addEvent(event) {
        this.model.reset();
        this.modal.openModal('CalendarAddModulesModal', true, this.injector)
            .subscribe(modalRef => {
                modalRef.instance.module$
                    .pipe(take(1))
                    .subscribe(module => {
                        if (module) {
                            this.model.module = module.name;
                            let presets: any = {[module.dateStartFieldName]: event};
                            if (module.name == 'UserAbsences') {
                                presets.user_id = this.calendar.owner;
                                presets.user_name = this.calendar.ownerName;
                            }
                            this.model.addModel('', null, presets);
                        }
                    });
            });
    }

}
