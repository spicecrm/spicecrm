/**
 * @module ModuleReports
 */
import {Component, Injector, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';

import {reporterconfig} from '../services/reporterconfig';
import {animate, style, transition, trigger} from "@angular/animations";
import {view} from "../../../services/view.service";

@Component({
    selector: 'reporter-detilview',
    templateUrl: './src/modules/reports/templates/reporterdetailview.html',
    providers: [view, model, reporterconfig],
    animations: [
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
    ]
})
export class ReporterDetailView implements OnInit {

    @ViewChild('presentationcontainer', {
        read: ViewContainerRef,
        static: true
    }) private presentationcontainer: ViewContainerRef;
    @ViewChild('presentationview', {read: ViewContainerRef, static: true}) private presentationview: ViewContainerRef;
    @ViewChild('pageheader', {read: ViewContainerRef, static: true}) private pageheader: ViewContainerRef;


    private vizData: any = {};
    private presComponent: any = undefined;

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
                private navigation: navigation,
                private router: Router,
                private reporterconfig: reporterconfig,
                private view: view) {
        /*
        this.routeSubscribe = this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
            this.model.module = 'KReports';
            this.model.id = this.id;
            this.model.getData(true, 'detailview').subscribe(data => {
                this.navigation.setActiveModule('KReports', this.model.id, data.summary_text);
                if (data.visualization_params != '') {
                    this.hasVisualization = true;
                }

                // load the where conditions
                this.reporterconfig.resetUserFilters();
                this.whereConditions = data.whereconditions;

                // render the presentation
                this.renderPresentation();

                // handle plugins
                if (data.integration_params != '')
                    this.integrationParams = data.integration_params;

            });
        });
         */
    }

    get presentationStyle() {
        if (this.presentationcontainer && this.presentationcontainer.element.nativeElement.getBoundingClientRect()) {
            let rect = this.presentationcontainer.element.nativeElement.getBoundingClientRect();
            return {
                height: 'calc(100vh - ' + rect.top + 'px)',
                overflow: 'hidden'
            };
        }
    }

    get filterPanelStyle() {
        let rect = this.pageheader.element.nativeElement.getBoundingClientRect();
        return {
            'right': '0px',
            'top': rect.bottom + 'px',
            'height': 'calc(100vh - ' + rect.bottom + 'px)',
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

    public ngOnInit(): void {

        // set theenavigation paradigm
        this.navigation.setActiveModule('KReports');

        // get the bean details
        this.model.module = this.activatedRoute.snapshot.params.module;
        this.model.id = this.activatedRoute.snapshot.params.id;


        this.model.getData(true, 'detailview', true, true).subscribe(data => {
            this.navigation.setActiveModule(this.model.module, this.model.id, data.summary_text);
            if (data.visualization_params != '') {
                let visualizationParams = data.visualization_params;
                if (visualizationParams && visualizationParams.layout && visualizationParams.layout != '-') {
                    this.hasVisualization = true;
                    this.visualizationHeight = data.visualization_params.chartheight ? data.visualization_params.chartheight : 300;
                }
            }

            // load the where conditions
            this.reporterconfig.resetUserFilters();
            this.whereConditions = data.whereconditions;

            // render the presentation
            this.renderPresentation();

            // handle plugins
            if (data.integration_params != '') {
                this.integrationParams = data.integration_params;
            }
        });

        this.view.isEditable = this.metadata.checkModuleAcl(this.model.module, 'edit');
    }

    private showPlugin(plugin) {
        return this.integrationParams.activePlugins && this.integrationParams.activePlugins[plugin];
    }

    private getVisualization() {

        this.backend.getRequest('KReporter/' + this.model.id + '/visualization').subscribe(vizData => {
            this.vizData = vizData;
        });
    }

    private renderPresentation() {
        if (this.presComponent) {
            this.presComponent.destroy();
            this.presComponent = undefined;
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
            this.metadata.addComponent(presentationComponent, this.presentationview).subscribe(componentRef => {
                this.presComponent = componentRef;
            });
        }
    }

    /*
     * for the filter pnale handling
     */
    private toggleFilters(event) {
        this.showFilters = event;
    }

    /**
     * when the filters are saved .. hide the panel
     */
    private filterapplied() {
        this.showFilters = false;
    }

    /**
     * trigger reload of the report
     */
    private refresh() {
        this.reporterconfig.refresh();
    }

    private startEditing() {
        this.router.navigate(['/module/KReports/designer/' + this.model.id]);
    }

    private goToModule() {
        this.router.navigate(['/module/' + this.model.module]);
    }
}
