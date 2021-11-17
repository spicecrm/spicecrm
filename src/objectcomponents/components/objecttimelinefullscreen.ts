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
    templateUrl: './src/objectcomponents/templates/objecttimelinefullscreen.html',
    providers: [timeline, model]
})
export class ObjectTimelineFullScreen implements OnInit, AfterViewInit {

    /**
     * a reference to the list container. Required to have a scroll handle and do the infinite scrolling
     */
    @ViewChild('listContainer', {read: ViewContainerRef, static: true}) private listContainer: ViewContainerRef;

    private dateInput: any;

    constructor(private timeline: timeline, private parent: model, private navigationTab: navigationtab, private language: language, private layout: layout) {

    }

    get parentName() {
        console.log(this.parent.data);
        return this.parent.data.name;
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

    private initialize(params) {
        this.parent.module = params.module;
        this.parent.id = params.id;
        this.timeline.parent = this.parent;
        this.parent.getData(true, '', true).subscribe(data => {
            // set the tab params
            this.timeline.parent.data = data;
            this.navigationTab.setTabInfo({displayname: this.parent.getField('summary_text') + ' • timeline'});
        });
    }

    /**
     * handles scrolling
     *
     * @param e the event emitted from teh DOM element
     */
    private onScroll(e) {
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
    private onResize() {
        this.timeline.smartView = this.listContainer.element.nativeElement.clientWidth < 742;
        this.timeline.smartFontSize = this.listContainer.element.nativeElement.clientWidth < 413;
    }
}

