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
    /**
     * holds the component config
     */
    public componentconfig: any = {};
    /**
     * holds the google visible boolean
     */
    public googleIsVisible: boolean = true;
    /**
     * dom reference to the calendar main container div
     */
    @ViewChild('calendarContainer', {read: ViewContainerRef, static: true}) private calendarContainer: ViewContainerRef;
    /**
     * element reference to the calendar header component
     */
    @ViewChild(CalendarHeader, {static: true}) private calendarHeader: CalendarHeader;
    /**
     * holds the subscriptions to unsubscribe on destroy
     */
    private subscriptions: Subscription = new Subscription();
    /**
     * holds the touch start listener
     */
    private touchStartListener: any;
    /**
     * holds the touch move listener
     */
    private touchMoveListener: any;
    /**
     * holds the resize listener
     */
    private resizeListener: any;
    /**
     * holds the touch down x position
     */
    private xDown: number = null;
    /**
     * holds the touch down y position
     */
    private yDown: number = null;
    /**
     * reference to this component to destroy
     */
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

    /**
     * @return sidebar width
     */
    get sidebarWidth() {
        return this.calendar.sidebarWidth;
    }

    /**
     * @return sidebar style
     */
    get sidebarStyle() {
        return {
            'width': this.calendar.sidebarWidth + 'px',
            'z-index': 1,
        };
    }

    /**
     * @return main container class
     */
    get mainContainerClass() {
        return !this.calendar.asPicker ? 'slds-theme--default' : 'slds-modal slds-fade-in-open slds-modal_large';
    }

    /**
     * @return sheet style
     */
    get sheetStyle() {
        return {
            width: `calc(100% - ${this.sidebarWidth}px)`,
            height: '100%',
        };
    }

    /**
     * set is mobile view
     */
    public ngAfterViewInit() {
        this.calendar.isMobileView = this.calendarContainer.element.nativeElement.getBoundingClientRect().width < 768;
        this.cdr.detectChanges();

    }

    /**
     * remove listeners and unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();

        if (this.resizeListener) {
            this.resizeListener();
        }
        if (this.touchStartListener) {
            this.touchStartListener();
        }
    }

    /**
     * set the schedule until date in the calendar header
     * @param event
     */
    private handleUntilDate(event) {
        this.calendarHeader.scheduleUntilDate = event;
    }

    /**
     * close the date picker in the calendar header and refresh
     * @param event
     */
    private setDateChanged(event) {
        this.calendarHeader.toggleClosed();
        this.calendar.refresh(event);
    }

    /**
     * set google is visible boolean value
     * @param value
     */
    private handleGoogleIsVisible(value) {
        this.googleIsVisible = value;
    }

    /**
     * close the modal when the calendar is used a picker
     */
    private closeModal() {
        this.self.destroy();
    }

    /**
     * handle calendar touch start to register a touch move listener
     * @param evt
     */
    private handleTouchStart(evt) {
        const touches = evt.touches || evt.originalEvent.touches;
        this.xDown = touches[0].clientX;
        this.yDown = touches[0].clientY;
        this.touchMoveListener = this.renderer.listen('document', 'touchmove', e => this.handleTouchMove(e));
    }

    /**
     * shift the calendar date by the touch move direction
     * @param evt
     */
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

    /**
     * open the add modules modal when the click event is emitted from the drop target
     * @param event
     */
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
