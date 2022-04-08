/**
 * @module ModuleActivities
 */
import {
    Component, OnDestroy, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import { Params} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {language} from '../../../services/language.service';
import {layout} from '../../../services/layout.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays a timeline summary with all activities from the parent record. Activities are on the left hand side, details on teh right hand side
 */
@Component({
    templateUrl: '../templates/activitytimelinesummary.html',
    providers: [activitiytimeline, model]
})
export class ActivityTimelineSummary implements OnInit, OnDestroy {
    /**
     * a reference to the list container. Required to have a scroll handle and do the infinite scrolling
     */
    @ViewChild('listContainer', {read: ViewContainerRef, static: true}) public listContainer: ViewContainerRef;

    /**
     * the module of the selcted activitis
     */
    public activitymodule: string;

    /**
     * the id of the current selcted activitiy
     */
    public activityid: string;

    /**
     * the data of the current selcted activitiy
     */
    public activitydata: any;

    /**
     * a subscription to cath the loading event
     */
    public subscription: any;

    public componentconfig: any;

    constructor(public metadata: metadata, public parent: model, public language: language, public activitiytimeline: activitiytimeline, public navigationtab: navigationtab, public layout: layout) {

        // check the componentconfig wether to use fts or not
        this.componentconfig = this.metadata.getComponentConfig('ActivityTimelineSummary');
        if (this.componentconfig.usefts) this.activitiytimeline.usefts = true;

        this.subscription = this.activitiytimeline.loading$.subscribe(loading => this.clearActivitiy());
    }

    public ngOnInit(): void {
        // initialize the tab
        this.initialize(this.navigationtab.activeRoute.params);
    }

    /**
     * handles the destory and unsubscribes from the activitiy service
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /**
     * loads the activities for the parent module
     */
    get activities() {
        return this.activitiytimeline.activities.History.list;
    }

    /**
     * a helper function that queries the layout service to not display a spülit screen on small devices. This shoudl not be done by media queries so the cmponent is not even rendered at all and kept hidden with an ngIf
     */
    get displayDetailsPane() {
        return this.layout.screenwidth != 'small';
    }

    get searchterm() {
        return this.activitiytimeline.filters.searchterm;
    }

    set searchterm(seacrhterm) {
        this.activitiytimeline.filters.searchterm = seacrhterm;
        this.activitiytimeline.reload();
    }

    /**
     * reloads the list
     */
    public reload() {
        this.activitiytimeline.reload();
    }

    /**
     * initializes when the activated Route returns the promise in the constructor
     *
     * @param params the Route Params returned
     */
    public initialize(params: Params) {
        // get the bean details
        this.parent.module = params.module;
        this.parent.id = params.id;
        this.parent.getData(true, '', true).subscribe(data => {
            // set the tab params
            this.navigationtab.setTabInfo({displayname: this.parent.getField('summary_text') + ' • ' + this.language.getModuleName( 'History'), displaymodule: 'History'});
        });

        this.activitiytimeline.parent = this.parent;
        this.activitiytimeline.defaultLimit = 25;
        this.activitiytimeline.modules = ['History'];
        this.activitiytimeline.reload();
    }

    /**
     * handles scrolling
     *
     * @param e the event emitted from teh DOM element
     */
    public onScroll(e) {
        let element = this.listContainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            if (this.activitiytimeline.canLoadMore('History')) {
                this.activitiytimeline.getMoreTimeLineData('History', 20);
            }
        }
    }

    /**
     * triggers setting the activitiy and thus updating the form on the right side with the activitiy content and details
     *
     * @param activity the activity
     */
    public setActivitiy(activity) {
        this.activitymodule = activity.module;
        this.activityid = activity.id;
        this.activitydata = activity.data;
    }

    /**
     * clears the active activitiy
     */
    public clearActivitiy() {
        this.activitymodule = '';
        this.activityid = '';
        this.activitydata = '';
    }

    /**
     * navigates to the parent model record. Used in the breadcrumbs
     */
    public goModel() {
        this.parent.goDetail();
    }

    /**
     * navigates to the parent module. Used in the breadcrumbs
     */
    public goModule() {
        this.parent.goModule();
    }
}
