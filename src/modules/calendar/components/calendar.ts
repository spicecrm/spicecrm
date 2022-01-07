/**
 * @module ModuleCalendar
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Injector,
    OnDestroy,
    Renderer2,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';
import {Subscription} from "rxjs";
import {CalendarHeader} from "./calendarheader";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {take} from "rxjs/operators";
import {metadata} from "../../../services/metadata.service";

declare var moment: any;

/**
 * Main container which displays a monitor panel, a header with tools and the calendar selected sheet.
 */
@Component({
    selector: 'calendar',
    templateUrl: '../templates/calendar.html',
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
    @ViewChild('calendarContainer', {read: ViewContainerRef, static: true}) public calendarContainer: ViewContainerRef;
    /**
     * element reference to the calendar header component
     */
    @ViewChild(CalendarHeader, {static: true}) public calendarHeader: CalendarHeader;
    /**
     * holds the subscriptions to unsubscribe on destroy
     */
    public subscriptions: Subscription = new Subscription();
    /**
     * holds the touch start listener
     */
    public touchStartListener: any;
    /**
     * holds the touch move listener
     */
    public touchMoveListener: any;
    /**
     * holds the resize listener
     */
    public resizeListener: any;
    /**
     * holds the touch down x position
     */
    public xDown: number = null;
    /**
     * holds the calendar main container class
     */
    public mainContainerClass: string = 'slds-theme--default';
    /**
     * holds the touch down y position
     */
    public yDown: number = null;
    /**
     * reference to this component to destroy
     */
    public self: any = {};

    constructor(public language: language,
                public navigation: navigation,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public modal: modal,
                public cdr: ChangeDetectorRef,
                public model: model,
                public metadata: metadata,
                public injector: Injector,
                public calendar: calendar) {

        this.navigation.setActiveModule('Calendar');
    }

    /**
     * @return sidebar width
     */
    get sidebarWidth() {
        return this.calendar.sidebarWidth;
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
     * add touch start listener
     * subscribe to event adding from drop target
     */
    public ngAfterViewInit() {
        if (this.calendar.asPicker) {
            this.mainContainerClass = 'slds-modal slds-fade-in-open slds-modal_large';
        }
        this.touchStartListener = this.renderer.listen('document', 'touchstart', e => this.handleTouchStart(e));
        this.handleMobileView();

        this.subscriptions.add(
            this.calendar.addingEvent$.subscribe(res => this.addEvent(res))
        );
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
     * add resize listener to set the mobile view boolean
     */
    public handleMobileView() {
        this.resizeListener = this.renderer.listen('window', 'resize', () => {
            this.calendar.setIsMobileView(this.calendarContainer.element.nativeElement.getBoundingClientRect().width < 768);
        });
        this.calendar.setIsMobileView(this.calendarContainer.element.nativeElement.getBoundingClientRect().width < 768);
    }

    /**
     * set the schedule until date in the calendar header
     * @param event
     */
    public handleUntilDate(event) {
        this.calendarHeader.scheduleUntilDate = event;
    }

    /**
     * close the date picker in the calendar header and refresh
     * @param event
     */
    public setDateChanged(event) {
        this.calendarHeader.toggleClosed();
        this.calendar.refresh(event);
    }

    /**
     * set google is visible boolean value
     * @param value
     */
    public handleGoogleIsVisible(value) {
        this.googleIsVisible = value;
    }

    /**
     * close the modal when the calendar is used a picker
     */
    public closeModal() {
        this.self.destroy();
    }

    /**
     * handle calendar touch start to register a touch move listener
     * @param evt
     */
    public handleTouchStart(evt) {
        const touches = evt.touches || evt.originalEvent.touches;
        this.xDown = touches[0].clientX;
        this.yDown = touches[0].clientY;
        this.touchMoveListener = this.renderer.listen('document', 'touchmove', e => this.handleTouchMove(e));
    }

    /**
     * shift the calendar date by the touch move direction
     * @param evt
     */
    public handleTouchMove(evt) {
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
    public addEvent(event) {
        this.model.reset();
        this.modal.openModal('CalendarAddModulesModal', true, this.injector)
            .subscribe(modalRef => {
                modalRef.instance.module$
                    .pipe(take(1))
                    .subscribe(module => {
                        if (module) {
                            this.model.module = module.name;
                            let presets: any = {[module.dateStartFieldName]: event};

                            // set a default date end date
                            if (module.dateEndFieldName) {
                                let dateEnd = moment(event).add(30, 'm');
                                presets[module.dateEndFieldName] = dateEnd;
                            }

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
