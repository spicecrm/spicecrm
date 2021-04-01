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
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {reporterconfig} from '../services/reporterconfig';
import {Subscription} from "rxjs";

/**
 * handle rendering the appropriate visualization component for the report
 */
@Component({
    selector: 'reporter-detail-visualization',
    templateUrl: './src/modules/reports/templates/reporterdetailvisualization.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailVisualization implements AfterViewInit, OnDestroy {
    @ViewChild('vizcontainer', {read: ViewContainerRef, static: true}) private vizcontainer: ViewContainerRef;

    /**
     * the parentmodule so if we are in the context that can be filtered properly
     */
    @Input() private parentModule: string = '';

    /**
     * the id of the parent reord also used to render in teh context
     */
    @Input() private parentId: string = '';

    /**
     * when the comonent is loading
     */
    private loading: boolean = true;

    /**
     * the vizualizationdata
     */
    private vizData: any = {};

    /**
     * the rendered chartcomponent
     */
    private chartComponent: any[] = [];

    /**
     * holds the subscriptions for thsi component
     */
    private subscriptions = new Subscription();

    constructor(private reporterconfig: reporterconfig,
                private metadata: metadata,
                private model: model,
                private backend: backend,
                private cdRef: ChangeDetectorRef) {
        this.subscriptions.add(
            this.reporterconfig.refresh$.subscribe(event => {
                this.getVisualization();
            })
        );
    }

    /**
     * load the visualization
     */
    public ngAfterViewInit() {
        this.getVisualization();
    }

    /**
     * unsubscribe from the service and other subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * gets the visualization for the report
     */
    private getVisualization() {

        this.loading = true;
        this.cdRef.detectChanges();

        let params: any = {};
        if (this.parentModule && this.parentId) {
            params.parentbeanId = this.parentId;
            params.parentbeanModule = this.parentModule;
        }

        // build wherecondition
        let whereConditions: any[] = [];
        for (let userFilter of this.reporterconfig.userFilters) {
            whereConditions.push({
                fieldid: userFilter.fieldid,
                operator: userFilter.operator,
                value: userFilter.value,
                valuekey: userFilter.valuekey,
                valueto: userFilter.valueto,
                valuetokey: userFilter.valuetokey
            });
        }
        params.whereConditions = JSON.stringify(whereConditions);

        this.backend.getRequest('KReporter/' + this.model.id + '/visualization', params).subscribe(vizData => {
            this.vizData = vizData;
            this.loading = false;
            this.cdRef.detectChanges();
            this.renderVisualization();
        });
    }

    /**
     * renders the visualization
     *
     * ToDo: remove the hardcoded components and keep this more flexibile in line with the architecture we are having
     */
    private renderVisualization() {
        // reset the view
        this.chartComponent.forEach(componentRef => componentRef.destroy());
        this.chartComponent = [];

        for (let visualization of this.vizData) {
            let visComponent = '';
            switch (visualization.plugin) {
                case 'highcharts':
                    visComponent = 'ReporterDetailVisualizationHighcharts';
                    break;
                case 'googlecharts':
                    visComponent = 'ReporterDetailVisualizationGooglecharts';
                    break;
                case 'googlemaps':
                    visComponent = 'ReporterDetailVisualizationGoogleMaps';
                    break;
            }
            if (visComponent != '') {
                this.metadata.addComponent(visComponent, this.vizcontainer).subscribe(componentRef => {
                    this.chartComponent.push(componentRef);
                    componentRef.instance.vizdata = visualization;
                    componentRef.changeDetectorRef.detectChanges();
                });
            }
        }
    }
}
