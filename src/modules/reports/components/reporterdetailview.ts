/**
 * @module ModuleReports
 */
import {Component, Injector, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
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

/**
 * @ignore
 */
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
    templateUrl: './src/modules/reports/templates/reporterdetailview.html',
    providers: [view, model, reporterconfig],
    animations: REPORTERDETAILVIEWANIMATIONS
})
export class ReporterDetailView implements OnInit {
    /**
     * container reference to render the presentation component inside
     */
    @ViewChild('presentationContainer', {
        read: ViewContainerRef,
        static: true
    }) private presentationContainer: ViewContainerRef;
    @ViewChild('pageHeader', {read: ViewContainerRef, static: true}) private pageHeader: ViewContainerRef;
    /**
     *
     */
    private presentationComponentRef: any = undefined;
    /**
     * set to true if the report should show the visualization
     */
    private hasVisualization: boolean = false;

    /**
     * the height of the visualization container
     */
    private visualizationHeight: number = 0;


    private whereConditions: any = {};
    private integrationParams: any = {};

    private showFilters: boolean = false;

    constructor(private broadcast: broadcast,
                private language: language,
                private metadata: metadata,
                private injector: Injector,
                private model: model,
                private backend: backend,
                private activatedRoute: ActivatedRoute,
                private navigationtab: navigationtab,
                private router: Router,
                private reporterconfig: reporterconfig,
                private view: view) {
    }

    get filterPanelStyle() {
        let rect = this.pageHeader.element.nativeElement.getBoundingClientRect();
        return {
            'right': '0px',
            'top': rect.bottom + 'px',
            'height': `calc(100vh - ${rect.bottom}px)`,
            'z-index': 100
        };
    }

    /**
     * returns the style to be set with ngStyle on the vis container
     */
    get visualizationStyle() {
        return {
            height: this.visualizationHeight + 'px'
        };
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
        this.subscribeToBroadcast();
    }

    /**
     * subscribe to broadcast message and refresh the results if the model match
     * and reset the views
     */
    private subscribeToBroadcast() {
        this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype == 'model.save' && msg.messagedata.module == this.model.module && msg.messagedata.id == this.model.id) {
                this.showFilters = false;
                this.whereConditions = msg.messagedata.data.whereconditions;
                this.setIntegrationParams(msg.messagedata.data.integration_params);
                this.setVisualizationProperties(msg.messagedata.data.visualization_params);
                this.renderPresentation();
                this.reporterconfig.refresh();
            }
        });
    }

    /**
     * set the navigation paradigm
     */
    private setNavigationTabInfos(displayName) {
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
    private setModelData() {
        this.model.module = this.navigationtab.activeRoute.params.module;
        this.model.id = this.navigationtab.activeRoute.params.id;

        this.model.getData(true, 'detailview', true, true).subscribe(data => {

            this.setNavigationTabInfos(data.summary_text);

            this.setVisualizationProperties(data.visualization_params);

            // load the where conditions
            this.reporterconfig.resetUserFilters();
            this.whereConditions = data.whereconditions;

            // render the presentation
            this.renderPresentation();
            this.setIntegrationParams(data.integration_params);
        });
    }

    /**
     * set the integration params
     */
    private setIntegrationParams(integrationParams) {
        this.integrationParams = undefined;
        if (!(!!integrationParams)) return;
        this.integrationParams = integrationParams;
    }

    /**
     * set the visualization properties
     * @param visualizationParams
     */
    private setVisualizationProperties(visualizationParams) {
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
    private renderPresentation() {
        if (this.presentationComponentRef) {
            this.presentationComponentRef.destroy();
            this.presentationComponentRef = undefined;
        }

        let presentationParams = this.model.data.presentation_params;

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
            });
        }
    }

    /*
     * toggle showing the filter panel
     */
    private toggleFilters(event) {
        this.showFilters = event;
    }

    /**
     * when the filters are saved hide the panel
     */
    private filterApplied() {
        this.showFilters = false;
    }
}
