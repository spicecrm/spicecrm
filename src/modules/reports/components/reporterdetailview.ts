/**
 * @module ModuleReports
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injector,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {broadcast} from '../../../services/broadcast.service';

import {reporterconfig} from '../services/reporterconfig';
import {animate, style, transition, trigger} from "@angular/animations";
import {view} from "../../../services/view.service";
import {Subscription} from "rxjs";

/** @ignore */
const REPORTERDETAILVIEWANIMATIONS = [
    trigger('displayfilter', [
        transition(':enter', [
            style({width: '0px', overflow: 'hidden'}),
            animate('.5s', style({width: '*'})),
            style({overflow: 'unset'})
        ]),
        transition(':leave', [
            style({overflow: 'hidden'}),
            animate('.5s', style({width: '0px'}))
        ])
    ])
];

/**
 * render the visualization and presentation components
 */
@Component({
    selector: 'reporter-detilview',
    templateUrl: '../templates/reporterdetailview.html',
    providers: [view, model, reporterconfig],
    animations: REPORTERDETAILVIEWANIMATIONS,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailView implements OnInit, OnDestroy {
    /**
     * container reference to render the presentation component inside
     */
    @ViewChild('presentationContainer', {
        read: ViewContainerRef,
        static: true
    }) public presentationContainer: ViewContainerRef;
    /**
     * container reference of the presentation component
     */
    public presentationComponentRef: any = undefined;
    /**
     * set to true if the report should show the visualization
     */
    public hasVisualization: boolean = false;

    /**
     * the height of the visualization container
     */
    public visualizationHeight: number = 0;

    /**
     * where conditions will be passed to the children
     */
    public whereConditions: any = {};
    /**
     * integration parms will be passed to the action buttons
     */
    public integrationParams: any = {};
    /**
     * show/hide filter panel
     */
    public showFilters: boolean = false;
    /**
     * to save observable subscriptions for unsubscribe purpose
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public broadcast: broadcast,
                public language: language,
                public metadata: metadata,
                public injector: Injector,
                public model: model,
                public backend: backend,
                public activatedRoute: ActivatedRoute,
                public navigationtab: navigationtab,
                public router: Router,
                public reporterconfig: reporterconfig,
                public cdRef: ChangeDetectorRef,
                public view: view) {

        this.subscribeToBroadcast();
    }

    /**
     * set the navigation tab infos
     * set the model data
     * set view editable from acl
     * subscribe to broadcast message
     */
    public ngOnInit(): void {

        this.setNavigationTabInfos(this.language.getModuleName(this.model.module));
        this.setModelData();
        this.view.isEditable = this.metadata.checkModuleAcl(this.model.module, 'edit');
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * subscribe to broadcast message and refresh the results if the model match
     * and reset the views
     */
    public subscribeToBroadcast() {
        this.subscriptions.add(
            this.broadcast.message$.subscribe(msg => {
                if (msg.messagetype == 'model.save' && msg.messagedata.module == this.model.module && msg.messagedata.id == this.model.id) {
                    this.showFilters = false;
                    // load the where conditions
                    this.reporterconfig.resetUserFilters();
                    this.whereConditions = msg.messagedata.data.whereconditions;
                    this.setIntegrationParams(msg.messagedata.data.integration_params);
                    this.setVisualizationProperties(msg.messagedata.data.visualization_params);
                    this.renderPresentation(msg.messagedata.data.presentation_params);
                    this.reporterconfig.refresh();
                    this.cdRef.detectChanges();
                }
            })
        );
    }

    /**
     * set the navigation paradigm
     */
    public setNavigationTabInfos(displayName) {
        this.navigationtab.setTabInfo({
            displayname: displayName,
            displaymodule: this.model.module
        });
    }

    /**
     * get the model data and set the navigation tab infos
     * redefine the where conditions
     * reset the integration params
     * set the hasVisualization to true and set the height of the visualization component
     */
    public setModelData() {
        this.model.module = this.navigationtab.activeRoute.params.module;
        this.model.id = this.navigationtab.activeRoute.params.id;

        this.model.getData(true, 'detailview', true, true).subscribe(data => {

            this.setNavigationTabInfos(data.summary_text);

            this.setVisualizationProperties(data.visualization_params);

            // load the where conditions
            this.reporterconfig.resetUserFilters();
            this.whereConditions = data.whereconditions;

            // render the presentation
            this.renderPresentation(data.presentation_params);
            this.setIntegrationParams(data.integration_params);
            this.cdRef.detectChanges();
        });
    }

    /**
     * set the integration params
     */
    public setIntegrationParams(integrationParams) {
        this.integrationParams = undefined;
        if (!(!!integrationParams)) return;
        this.integrationParams = integrationParams;
    }

    /**
     * set the visualization properties
     * @param visualizationParams
     */
    public setVisualizationProperties(visualizationParams) {
        this.hasVisualization = false;
        if (!(!!visualizationParams)) return;

        if (visualizationParams && visualizationParams.layout && visualizationParams.layout != '-') {
            this.hasVisualization = true;
            this.visualizationHeight = visualizationParams.chartheight ? visualizationParams.chartheight : 300;
        }
    }

    /**
     * render the presentation component
     */
    public renderPresentation(presentationParams) {

        if (this.presentationComponentRef) {
            this.presentationComponentRef.destroy();
            this.presentationComponentRef = undefined;
        }

        if (!presentationParams) return;

        let presentationComponent = '';
        switch (presentationParams.plugin) {
            case 'standard':
                presentationComponent = 'ReporterDetailPresentationStandard';
                break;
            case 'grouped':
                presentationComponent = 'ReporterDetailPresentationGrouped';
                break;
            case 'standardws':
                presentationComponent = 'ReporterDetailPresentationStandardWS';
                break;
            case 'tree':
                presentationComponent = 'ReporterDetailPresentationTree';
                break;
            case 'pivot':
                presentationComponent = 'ReporterDetailPresentationPivot';
                break;
        }

        if (presentationComponent != '') {
            this.metadata.addComponent(presentationComponent, this.presentationContainer).subscribe(componentRef => {
                this.presentationComponentRef = componentRef;
                this.presentationComponentRef.changeDetectorRef.detectChanges();
            });
        }
    }

    /*
     * toggle showing the filter panel
     */
    public toggleFilters(event) {
        this.showFilters = event;
    }

    /**
     * when the filters are saved hide the panel
     */
    public filterApplied() {
        this.showFilters = false;
    }
}
