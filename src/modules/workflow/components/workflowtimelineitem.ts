/**
 * @module ModuleWorkflow
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
 * a generic component to render a workflowtask in the activity timeline (assitant)
 */
@Component({
    selector: 'workflowtimeline-item',
    templateUrl: '../templates/workflowtimelineitem.html',
    providers: [model, view],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowTimelineItem implements OnInit, OnDestroy, AfterViewInit {

    /**
     * the activity data passed in the component
     */
    @Input() public activity: any = {};

    /**
     * if set to truie a toolset is shown
     */
    @Input() public showtoolset: boolean = true;

    /**
     * the fieldset that is rendered in teh form if the item is expandad
     */
    public formFieldSet: string = '';

    /**
     * the fieldset used in the main header line
     */
    public headerFieldSet: string;

    /**
     * the fieldset used in teh subline
     */
    public subheaderFieldSet: string;

    /**
     * the componmentconfig passed in
     */
    public componentconfig: any = {};

    /**
     * the module to be displayed
     */
    @Input() public module: string;

    /**
     * holds all subsriptions for the component
     */
    public subscriptions: Subscription = new Subscription();

    constructor(
        public model: model,
        public metadata: metadata,
        public view: view,
        public userpreferences: userpreferences,
        public session: session,
        public language: language,
        @Optional() public activitiytimeline: activitiytimeline,
        public cdref: ChangeDetectorRef
    ) {
        this.view.isEditable = false;
        this.view.displayLabels = true;

    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.model.id = this.activity.id;
        this.model.setData(this.activity.data);
        this.model.module = this.activity.module;


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
                    this.cdref.detectChanges();
                })
            );
        }

    }


    /**
     * ensure we unsubcrie of any subscription we might have
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
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

    get activitiyDate() {

        const date = new moment.utc(this.activity.date_activity).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));

        const isToday = date.format('YYYYMMDD') == new moment().format('YYYYMMDD');
        const isThisYear = date.format('YYYY') == new moment().format('YYYY');

        if (isToday) {
            return date.format(this.userpreferences.getTimeFormat());
        } else if (isThisYear) {
            return date.format('MMM D');
        } else {
            return date.format(this.userpreferences.getDateFormat());
        }
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
        return !this.formFieldSet;
    }

    /**
     * checks modsl ACL rules and if allowed enables get details
     */
    get enableDetail() {
        return this.model.checkAccess('detail');
    }

    /**
     * run change detection after the action fired
     *
     * @param action
     */
    public handleAction(action) {
        this.cdref.detectChanges();
    }

    /**
     * navigate to the records
     */
    public goDetail() {
        if (this.enableDetail) this.model.goDetail();
    }

}
