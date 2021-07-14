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
    templateUrl: './src/modules/reports/templates/reporterdetailview.html',
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
    }) private presentationContainer: ViewContainerRef;
    /**
     * container reference of the presentation component
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

    /**
     * where conditions will be passed to the children
     */
    private whereConditions: any = {};
    /**
     * integration parms will be passed to the action buttons
     */
    private integrationParams: any = {};
    /**
     * show/hide filter panel
     */
    private showFilters: boolean = false;
    /**
     * to save observable subscriptions for unsubscribe purpose
     */
    private subscriptions: Subscription = new Subscription();

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
                private cdRef: ChangeDetectorRef,
                private view: view) {

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
    private subscribeToBroadcast() {
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
            this.renderPresentation(data.presentation_params);
            this.setIntegrationParams(data.integration_params);
            this.cdRef.detectChanges();
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
    private renderPresentation(presentationParams) {

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
