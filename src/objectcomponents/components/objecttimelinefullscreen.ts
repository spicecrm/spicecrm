/**
 * @module ObjectComponents
 */
import {AfterViewInit, Component, HostListener, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {timeline} from "../../services/timeline.service";
import {model} from "../../services/model.service";
import {navigationtab} from "../../services/navigationtab.service";
import {language} from "../../services/language.service";
import {layout} from "../../services/layout.service";

declare var moment;

@Component({
    selector: 'object-timeline-full-screen',
    templateUrl: '../templates/objecttimelinefullscreen.html',
    providers: [timeline, model]
})
export class ObjectTimelineFullScreen implements OnInit, AfterViewInit {

    /**
     * a reference to the list container. Required to have a scroll handle and do the infinite scrolling
     */
    @ViewChild('listContainer', {read: ViewContainerRef, static: true}) public listContainer: ViewContainerRef;

    public dateInput: any;

    constructor(public timeline: timeline, public parent: model, public navigationTab: navigationtab, public language: language, public layout: layout) {

    }

    get parentName() {

        return this.parent.getField('name');
    }

    get displayDetailsPanel() {
        return this.layout.screenwidth != 'small';
    }

    get ftsSearchTerm() {
        return this.timeline.filters.searchterm;
    }

    set ftsSearchTerm(searchterm) {
        this.timeline.filters.searchterm = searchterm;
        this.timeline.reload();
    }

    get date() {
        return this.timeline.timeRangeStart;
    }

    set date(val) {
        this.timeline.timeRangeStart = val;
        this.timeline.reload();
    }

    public trackByFunction(index: number, item) {
        return item.id;
    }

    public ngOnInit() {
        this.onResize();
        this.dateInput = this.timeline.startDate;
        this.initialize(this.navigationTab.activeRoute.params);
        this.timeline.getTimelineData();
    }

    public ngAfterViewInit() {
        this.onResize();
    }

    public goModule() {
        this.parent.goModule();
    }

    public goModel() {
        this.parent.goDetail();
    }

    public initialize(params) {
        this.parent.module = params.module;
        this.parent.id = params.id;
        this.timeline.parent = this.parent;
        this.parent.getData(true, '', true).subscribe(data => {
            // set the tab params
            this.timeline.parent.setData(data);
            this.navigationTab.setTabInfo({displayname: this.parent.getField('summary_text') + ' • timeline'});
        });
    }

    /**
     * handles scrolling
     *
     * @param e the event emitted from teh DOM element
     */
    public onScroll(e) {
        let element = this.listContainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            if (this.timeline.canLoadMore()) {
                this.timeline.loadMore();
            }
        }
    }

    public reload() {
        this.timeline.reload();
        this.timeline.clearRecord();
    }

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.timeline.smartView = this.listContainer.element.nativeElement.clientWidth < 742;
        this.timeline.smartFontSize = this.listContainer.element.nativeElement.clientWidth < 413;
    }
}

