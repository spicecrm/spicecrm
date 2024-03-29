/*
SpiceUI 2021.01.001

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
import {
    AfterViewInit,
    Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';

import {view} from "../../services/view.service";
import {timeline} from "../../services/timeline.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";

declare var moment;

@Component({
    selector: 'object-timeline',
    templateUrl: '../templates/objecttimeline.html',
    providers: [view, timeline]
})
export class ObjectTimeline implements OnInit, AfterViewInit {

    @ViewChild('timelinecontent') public content: ElementRef;

    public loading: boolean;

    public loadingMore: boolean;

    public hasRecords: boolean;

    constructor(public element: ElementRef, public timeline: timeline, public language: language, public model: model, public el: ElementRef) {
    }

    public ngOnInit() {
        this.timeline.parent = this.model;
        this.timeline.getTimelineData();
    }

    public ngAfterViewInit() {
        this.onResize();
    }

    public reload() {
        this.timeline.reload();
    }

    public trackByFunction(index: number, item) {
        return item.id;
    }

    public get ftsSearchTerm() {
        return this.timeline.filters.searchterm;
    }

    public set ftsSearchTerm(searchterm) {
        this.timeline.filters.searchterm = searchterm;
        this.timeline.reload();
    }

    public closeDialog() {
        this.timeline.reload();
    }

    get date() {
        return this.timeline.timeRangeStart;
    }

    set date(val) {
        this.timeline.timeRangeStart = val;
        this.timeline.reload();
    }

    @HostListener('window:resize', ['$event']) public onResize() {
        this.timeline.smartView = this.el.nativeElement.getBoundingClientRect().width < 730;
        this.timeline.smartFontSize = this.el.nativeElement.getBoundingClientRect().width < 380;
    }
}
