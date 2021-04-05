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
 * @module ModuleActivities
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit, Optional
} from '@angular/core';
import {model} from '../../../services/model.service';
import {modelattachments} from '../../../services/modelattachments.service';
import {view} from '../../../services/view.service';
import {session} from '../../../services/session.service';
import {metadata} from '../../../services/metadata.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {language} from "../../../services/language.service";
import {activitiytimeline} from "../../../services/activitiytimeline.service";
import {Subscription} from "rxjs";

declare var moment: any;
declare var _: any;

/**
 * a generic component to render an item in teh activity timeline
 */
@Component({
    selector: 'activitytimeline-item',
    templateUrl: './src/modules/activities/templates/activitytimelineitem.html',
    providers: [model, modelattachments, view],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityTimelineItem implements OnInit, OnDestroy, AfterViewInit {

    /**
     * the activity data passed in the component
     */
    @Input() private activity: any = {};

    /**
     * if set to truie a toolset is shown
     */
    @Input() private showtoolset: boolean = true;

    /**
     * the fieldset that is rendered in teh form if the item is expandad
     */
    private formFieldSet: string = '';

    /**
     * the fieldset used in the main header line
     */
    private headerFieldSet: string;

    /**
     * the fieldset used in teh subline
     */
    private subheaderFieldSet: string;

    /**
     * indicates if the
     */
    private isopen: boolean = false;

    /**
     * the componmentconfig passed in
     */
    public componentconfig: any = {};

    /**
     * the module to be displayed
     */
    @Input() private module: string;

    /**
     * holds all subsriptions for the component
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private model: model, private modelattachments: modelattachments, private metadata: metadata, private view: view, private userpreferences: userpreferences, private session: session, private language: language, @Optional() private activitiytimeline: activitiytimeline, private cdref: ChangeDetectorRef) {
        this.view.isEditable = false;
        this.view.displayLabels = true;

        // set the openness initially from the service
        this.isopen = activitiytimeline ? activitiytimeline.openness : false;

    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.model.id = this.activity.id;
        this.model.data = this.activity.data;
        this.model.module = this.activity.module;

        // initiate the model attachment
        if (this.displayattachments) {
            this.modelattachments.module = this.model.module;
            this.modelattachments.id = this.model.id;
        }

        let defaultcomponentconfig = this.metadata.getComponentConfig('ActivityTimelineItem', this.model.module);

        // get the header fieldset
        this.headerFieldSet = this.componentconfig.headerfieldset ? this.componentconfig.headerfieldset : defaultcomponentconfig.headerfieldset;

        // get the subheader fieldset
        this.subheaderFieldSet = this.componentconfig.subheaderfieldset ? this.componentconfig.subheaderfieldset : defaultcomponentconfig.subheaderfieldset;

        // set the fieldset
        this.formFieldSet = this.componentconfig.fieldset;
    }

    /**
     * once the view is initialized subscribe to the changes
     */
    public ngAfterViewInit(): void {
        // subscribe to the openess
        if (this.activitiytimeline) {
            this.subscriptions.add(this.activitiytimeline.openness$.subscribe(state => {
                    this.isopen = state;
                    this.cdref.detectChanges();
                })
            );
        }

        // subscribe to the event when the attcahments are loaded
        this.subscriptions.add(this.modelattachments.loaded$.subscribe(loaded => {
            this.cdref.detectChanges();
        }));
    }


    /**
     * ensure we unsubcrie of any subscription we might have
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns the id of the actionset as set in the config
     */
    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * returns the id of the actionset as set in the config
     */
    get displayattachments() {
        return this.componentconfig.displayattachments;
    }

    /**
     * returns the model has attachments
     */
    get hasattachments() {
        return this.componentconfig.displayattachments && this.modelattachments.count > 0;
    }

    /**
     * fired when the attcahments are laoded to trigger the change detection
     */
    private attachmentsloaded() {
        this.cdref.detectChanges();
    }

    /**
     * returns the subject
     */
    get subject() {
        let subject = this.model.getField('summary_text');
        return subject ? subject : '-- no subject --';
    }

    /**
     * gets the activity time and returns it formatted
     */
    get starttime() {
        let startdate = new moment.utc(this.activity.date_activity).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));
        return startdate ? startdate.format(this.userpreferences.getTimeFormat()) : '';
    }

    /**
     * gets the activity date and returns it formatted
     */
    get startdate() {
        let startdate = new moment.utc(this.activity.date_activity).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));
        return startdate ? startdate.format(this.userpreferences.getDateFormat()) : '';
    }

    /**
     * returns ture if the date is today / day based
     */
    get isToday() {
        let today = new moment.utc().tz(this.session.getSessionData('timezone'));
        return this.module == 'Activities' && new moment.utc(this.activity.date_activity).tz(this.session.getSessionData('timezone')).isSame(today, 'day');
    }

    /**
     * returns ture if the date is in treh past / day based
     */
    get isPast() {
        let today = new moment.utc().tz(this.session.getSessionData('timezone'));
        return this.module == 'Activities' && new moment.utc(this.activity.date_activity).tz(this.session.getSessionData('timezone')).isBefore(today, 'day');
    }

    /**
     * returns true if no fieldset for the expanded form is set and thus expanding is not possible
     */
    get cantexpand() {
        return this.formFieldSet == '';
    }

    /**
     * checks modsl ACL rules and if allowed enables get details
     */
    get enableDetail() {
        return this.model.checkAccess('detail');
    }

    /**
     * navigate to the records
     */
    private goDetail() {
        if (this.enableDetail) this.model.goDetail();
    }

    /**
     * toggles the state between expanded and collapsed
     */
    private toggleexpand() {
        this.isopen = !this.isopen;

        // if expanded and not laoded yet load the atachments
        if (this.isopen && this.componentconfig.displayattachments && !this.modelattachments.loaded) {
            this.modelattachments.getAttachments();
        }
    }
}
