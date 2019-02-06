import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
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

declare var moment: any;
declare var _: any;

@Component({
    selector: 'calendar-three-days-dashlet',
    templateUrl: './src/modules/calendar/templates/calendarthreedaysdashlet.html',
    providers: [calendar]
})

export class CalendarThreeDaysDashlet implements OnDestroy {
    @ViewChild('calendarcontent', {read: ViewContainerRef}) private calendarcontent: ViewContainerRef;
    @ViewChild('headercontainer', {read: ViewContainerRef}) private headerContainer: ViewContainerRef;
    private subscription: Subscription = new Subscription();
    private touchStartListener: any;
    private touchMoveListener: any;
    private xDown: number = null;
    private yDown: number = null;
    private titleUntilDate: any = {};

    constructor(private language: language,
                private navigation: navigation,
                private elementRef: ElementRef,
                private renderer: Renderer2,
                private calendar: calendar) {
        this.calendar.isDashlet = true;
        this.subscription = this.language.currentlanguage$.subscribe(lang => this.calendar.calendarDate = moment(this.calendar.calendarDate));
        this.touchStartListener = this.renderer.listen('document', 'touchstart', e => this.handleTouchStart(e));
        this.titleUntilDate = moment(this.calendar.calendarDate).add(2, 'd');
    }

    get calendarDate() {
        return this.calendar.calendarDate;
    }

    get contentStyle() {
        return {
            height: `calc(100% - ${this.headerContainer.element.nativeElement.offsetHeight}px)`,
            width: '100%'
        };
    }

    get title() {
        return moment(this.calendar.calendarDate).format("MMM D") + ' - ' + this.titleUntilDate.format("MMM D");
    }

    public ngOnDestroy() {
        if (this.touchStartListener) {
            this.touchStartListener();
        }
        if (this.touchMoveListener) {
            this.touchMoveListener();
        }
    }

    private handleTouchStart(evt) {
        const touches = evt.touches || evt.originalEvent.touches;
        this.xDown = touches[0].clientX;
        this.yDown = touches[0].clientY;
        this.touchMoveListener = this.renderer.listen('document', 'touchmove', e => this.handleTouchMove(e));
    }

    private handleTouchMove(evt) {
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
        this.touchMoveListener();
    }
}